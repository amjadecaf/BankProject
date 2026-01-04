package ma.formations.multiconnector.service;


import lombok.AllArgsConstructor;
import ma.formations.multiconnector.dao.BankAccountRepository;
import ma.formations.multiconnector.dao.CustomerRepository;
import ma.formations.multiconnector.dtos.bankaccount.AddBankAccountRequest;
import ma.formations.multiconnector.dtos.bankaccount.AddBankAccountResponse;
import ma.formations.multiconnector.dtos.bankaccount.BankAccountDto;
import ma.formations.multiconnector.enums.AccountStatus;
import ma.formations.multiconnector.service.exception.BusinessException;
import ma.formations.multiconnector.service.model.BankAccount;
import ma.formations.multiconnector.service.model.Customer;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class BankAccountServiceImpl implements IBankAccountService {
    private final BankAccountRepository bankAccountRepository;
    private final CustomerRepository customerRepository;
    private ModelMapper modelMapper;


    @Override
    public AddBankAccountResponse saveBankAccount(AddBankAccountRequest dto) {
        // RG_9: Validate RIB format (24 characters: MA + 22 digits)
        if (!isValidRib(dto.getRib())) {
            throw new BusinessException("Le RIB doit contenir 24 caractères (MA suivi de 22 chiffres)");
        }


        bankAccountRepository.findByRib(dto.getRib()).ifPresent(a -> {
            throw new BusinessException(String.format("Le RIB [%s] existe déjà", dto.getRib()));
        });

        // Find customer by identity number (RG_8)
        Customer customer = customerRepository.findByIdentityNumber(dto.getIdentityNumber())
                .orElseThrow(() -> new BusinessException(String.format("Aucun client avec le numéro d'identité: %s n'existe", dto.getIdentityNumber())));

        // Create bank account
        BankAccount bankAccount = new BankAccount();
        bankAccount.setRib(dto.getRib());
        bankAccount.setAmount(dto.getAmount() != null ? dto.getAmount() : 0.0);
        bankAccount.setAccountStatus(AccountStatus.OPENED); // RG_10
        bankAccount.setCustomer(customer);
        bankAccount.setCreatedAt(new Date());
        
        BankAccount saved = bankAccountRepository.save(bankAccount);
        AddBankAccountResponse response = modelMapper.map(saved, AddBankAccountResponse.class);
        response.setMessage(String.format("Compte bancaire RIB [%s] créé avec succès pour le client [%s]", dto.getRib(), dto.getIdentityNumber()));
        return response;
    }


    private boolean isValidRib(String rib) {
        if (rib == null || rib.length() != 24) {
            return false;
        }
        
        // Check if starts with MA
        if (!rib.startsWith("MA")) {
            return false;
        }
        
        // Check if remaining 22 characters are digits
        String digits = rib.substring(2);
        return digits.matches("\\d{22}");
    }

    @Override
    public List<BankAccountDto> getAllBankAccounts() {
        return bankAccountRepository.findAll().stream().
                map(bankAccount -> modelMapper.map(bankAccount, BankAccountDto.class)).
                collect(Collectors.toList());
    }

    @Override
    public BankAccountDto getBankAccountByRib(String rib) {
        return modelMapper.map(bankAccountRepository.findByRib(rib).orElseThrow(
                () -> new BusinessException(String.format("No Bank Account with rib [%s] exist", rib))), BankAccountDto.class);
    }
}
