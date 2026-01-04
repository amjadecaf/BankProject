package ma.formations.multiconnector.service;

import lombok.AllArgsConstructor;
import ma.formations.multiconnector.dao.BankAccountRepository;
import ma.formations.multiconnector.dao.BankAccountTransactionRepository;
import ma.formations.multiconnector.dao.UserRepository;
import ma.formations.multiconnector.dtos.transfer.TransferRequest;
import ma.formations.multiconnector.dtos.transfer.TransferResponse;
import ma.formations.multiconnector.enums.AccountStatus;
import ma.formations.multiconnector.enums.TransactionType;
import ma.formations.multiconnector.service.exception.BusinessException;
import ma.formations.multiconnector.service.model.BankAccount;
import ma.formations.multiconnector.service.model.BankAccountTransaction;
import ma.formations.multiconnector.service.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@Transactional
@AllArgsConstructor
public class TransferServiceImpl implements ITransferService {

    private final BankAccountRepository bankAccountRepository;
    private final BankAccountTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Override
    public TransferResponse executeTransfer(TransferRequest request, String username) {
        // Validate inputs
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new BusinessException("Le montant doit être positif");
        }

        // Find user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));

        // Find source account
        BankAccount sourceAccount = bankAccountRepository.findByRib(request.getSourceRib())
                .orElseThrow(() -> new BusinessException("Compte source non trouvé avec le RIB: " + request.getSourceRib()));

        // Find destination account
        BankAccount destinationAccount = bankAccountRepository.findByRib(request.getDestinationRib())
                .orElseThrow(() -> new BusinessException("Compte destinataire non trouvé avec le RIB: " + request.getDestinationRib()));

        // Validate business rules (RG_11, RG_12)
        validateTransfer(sourceAccount, destinationAccount, request.getAmount());

        // Perform transfer (RG_13, RG_14)
        sourceAccount.setAmount(sourceAccount.getAmount() - request.getAmount());
        destinationAccount.setAmount(destinationAccount.getAmount() + request.getAmount());

        // Create debit transaction (RG_15)
        BankAccountTransaction debitTransaction = BankAccountTransaction.builder()
                .amount(request.getAmount())
                .transactionType(TransactionType.DEBIT)
                .bankAccount(sourceAccount)
                .user(user)
                .date(new Date())
                .createdAt(new Date())
                .build();

        // Create credit transaction (RG_15)
        BankAccountTransaction creditTransaction = BankAccountTransaction.builder()
                .amount(request.getAmount())
                .transactionType(TransactionType.CREDIT)
                .bankAccount(destinationAccount)
                .user(user)
                .date(new Date())
                .createdAt(new Date())
                .build();

        // Save transactions
        BankAccountTransaction savedDebit = transactionRepository.save(debitTransaction);
        BankAccountTransaction savedCredit = transactionRepository.save(creditTransaction);

        return TransferResponse.builder()
                .success(true)
                .message(String.format("Virement de %.2f MAD effectué avec succès de %s vers %s", 
                    request.getAmount(), request.getSourceRib(), request.getDestinationRib()))
                .debitTransactionId(savedDebit.getId())
                .creditTransactionId(savedCredit.getId())
                .build();
    }

    private void validateTransfer(BankAccount source, BankAccount destination, Double amount) {
        // RG_11: Check source account status
        if (source.getAccountStatus() == AccountStatus.BLOCKED) {
            throw new BusinessException("Le compte source est bloqué");
        }
        if (source.getAccountStatus() == AccountStatus.CLOSED) {
            throw new BusinessException("Le compte source est clôturé");
        }

        // Check destination account status
        if (destination.getAccountStatus() == AccountStatus.BLOCKED) {
            throw new BusinessException("Le compte destinataire est bloqué");
        }
        if (destination.getAccountStatus() == AccountStatus.CLOSED) {
            throw new BusinessException("Le compte destinataire est clôturé");
        }

        // RG_12: Check sufficient balance
        if (source.getAmount() < amount) {
            throw new BusinessException(String.format("Solde insuffisant. Solde actuel: %.2f MAD, Montant demandé: %.2f MAD", 
                source.getAmount(), amount));
        }
    }
}
