package ma.formations.multiconnector.service;

import lombok.AllArgsConstructor;
import ma.formations.multiconnector.dao.BankAccountRepository;
import ma.formations.multiconnector.dao.BankAccountTransactionRepository;
import ma.formations.multiconnector.dao.CustomerRepository;
import ma.formations.multiconnector.dtos.dashboard.AccountSummary;
import ma.formations.multiconnector.dtos.dashboard.DashboardResponse;
import ma.formations.multiconnector.dtos.transaction.TransactionDto;
import ma.formations.multiconnector.service.exception.BusinessException;
import ma.formations.multiconnector.service.model.BankAccount;
import ma.formations.multiconnector.service.model.BankAccountTransaction;
import ma.formations.multiconnector.service.model.Customer;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final BankAccountRepository bankAccountRepository;
    private final BankAccountTransactionRepository transactionRepository;
    private final ModelMapper modelMapper;

    public DashboardResponse getDashboard(String username, String selectedRib, int page, int size) {
        // Get customer by username
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Client non trouvé"));

        List<BankAccount> accounts = customer.getBankAccounts();
        if (accounts == null || accounts.isEmpty()) {
            throw new BusinessException("Aucun compte bancaire trouvé pour ce client");
        }

        // Create account summaries
        List<AccountSummary> accountSummaries = accounts.stream()
                .map(account -> {
                    Date lastTransactionDate = account.getBankAccountTransactionList() != null && 
                            !account.getBankAccountTransactionList().isEmpty()
                            ? account.getBankAccountTransactionList().stream()
                                    .map(BankAccountTransaction::getCreatedAt)
                                    .max(Date::compareTo)
                                    .orElse(account.getCreatedAt())
                            : account.getCreatedAt();
                    
                    return AccountSummary.builder()
                            .rib(account.getRib())
                            .balance(account.getAmount())
                            .lastTransactionDate(lastTransactionDate)
                            .build();
                })
                .collect(Collectors.toList());

        // Determine which account to display
        BankAccount selectedAccount;
        if (selectedRib != null && !selectedRib.isEmpty()) {
            selectedAccount = accounts.stream()
                    .filter(acc -> acc.getRib().equals(selectedRib))
                    .findFirst()
                    .orElseThrow(() -> new BusinessException("RIB invalide"));
        } else {
            // Select most recently used account
            selectedAccount = accountSummaries.stream()
                    .max(Comparator.comparing(AccountSummary::getLastTransactionDate))
                    .map(summary -> accounts.stream()
                            .filter(acc -> acc.getRib().equals(summary.getRib()))
                            .findFirst()
                            .orElseThrow())
                    .orElse(accounts.get(0));
        }

        // Get transactions with pagination
        Page<BankAccountTransaction> transactionPage = transactionRepository.findByBankAccount(
                selectedAccount,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"))
        );

        List<TransactionDto> transactionDtos = transactionPage.getContent().stream()
                .map(transaction -> modelMapper.map(transaction, TransactionDto.class))
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .accounts(accountSummaries)
                .selectedRib(selectedAccount.getRib())
                .selectedAccountBalance(selectedAccount.getAmount())
                .recentTransactions(transactionDtos)
                .totalPages(transactionPage.getTotalPages())
                .totalTransactions(transactionPage.getTotalElements())
                .build();
    }
}
