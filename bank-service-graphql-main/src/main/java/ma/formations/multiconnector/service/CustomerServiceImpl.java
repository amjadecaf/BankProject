package ma.formations.multiconnector.service;

import lombok.AllArgsConstructor;
import ma.formations.multiconnector.dao.CustomerRepository;
import ma.formations.multiconnector.dao.RoleRepository;
import ma.formations.multiconnector.dtos.customer.*;
import ma.formations.multiconnector.service.exception.BusinessException;
import ma.formations.multiconnector.service.model.Customer;
import ma.formations.multiconnector.service.model.Role;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class CustomerServiceImpl implements ICustomerService {

    private final CustomerRepository customerRepository;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @Override
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customer -> modelMapper.map(customer, CustomerDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public AddCustomerResponse createCustomer(AddCustomerRequest dto) {
        // RG_4: Validate unique identity number
        customerRepository.findByIdentityNumber(dto.getIdentityNumber()).ifPresent(c -> {
            throw new BusinessException("Le numéro d'identité " + dto.getIdentityNumber() + " existe déjà");
        });

        // RG_6: Validate unique email
        customerRepository.findByEmail(dto.getEmail()).ifPresent(c -> {
            throw new BusinessException("L'adresse email " + dto.getEmail() + " est déjà utilisée");
        });

        // Validate age (must be at least 18 years old)
        if (!isAtLeast18YearsOld(dto.getBirthDate())) {
            throw new BusinessException("Le client doit avoir au moins 18 ans");
        }

        // Generate random username and password
        String username = generateUsername(dto.getFirstname(), dto.getLastname());
        String rawPassword = generateRandomPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        Customer customer = new Customer();
        customer.setFirstname(dto.getFirstname());
        customer.setLastname(dto.getLastname());
        customer.setIdentityNumber(dto.getIdentityNumber());
        customer.setBirthDate(dto.getBirthDate());
        customer.setEmail(dto.getEmail());
        customer.setPostalAddress(dto.getPostalAddress());
        customer.setUsername(username);
        customer.setPassword(passwordEncoder.encode(rawPassword));
        customer.setEnabled(true);
        customer.setAccountNonExpired(true);
        customer.setAccountNonLocked(true);
        customer.setCredentialsNonExpired(true);

        // Add CLIENT role
        Role clientRole = roleRepository.findByAuthority("ROLE_CLIENT")
                .orElseThrow(() -> new BusinessException("Role CLIENT not found"));
        customer.getAuthorities().add(clientRole);

        Customer savedCustomer = customerRepository.save(customer);

        // Send email with credentials
        emailService.sendNewClientCredentials(
            savedCustomer.getEmail(),
            savedCustomer.getFirstname(),
            savedCustomer.getLastname(),
            username,
            rawPassword
        );

        AddCustomerResponse response = modelMapper.map(savedCustomer, AddCustomerResponse.class);
        response.setMessage(String.format("Client [%s %s] créé avec succès. Un email a été envoyé à %s",
            savedCustomer.getFirstname(), savedCustomer.getLastname(), savedCustomer.getEmail()));
        return response;
    }

    @Override
    public UpdateCustomerResponse updateCustomer(String identityNumber, UpdateCustomerRequest updateCustomerRequest) {
        Customer customerToPersist = modelMapper.map(updateCustomerRequest, Customer.class);
        Customer customerFound = customerRepository.findByIdentityNumber(identityNumber)
                .orElseThrow(() -> new BusinessException(String.format("Aucun client avec le numéro d'identité [%s] n'existe", identityNumber)));
        
        customerToPersist.setId(customerFound.getId());
        customerToPersist.setIdentityNumber(identityNumber);
        UpdateCustomerResponse updateCustomerResponse = modelMapper.map(customerRepository.save(customerToPersist), UpdateCustomerResponse.class);
        updateCustomerResponse.setMessage(String.format("Client %s mis à jour avec succès", identityNumber));
        return updateCustomerResponse;
    }

    @Override
    public CustomerDto getCustomByIdentity(String identityNumber) {
        return modelMapper.map(customerRepository.findByIdentityNumber(identityNumber)
                .orElseThrow(() -> new BusinessException(String.format("Aucun client avec le numéro d'identité [%s] n'existe", identityNumber))),
                CustomerDto.class);
    }

    @Override
    public String deleteCustomerByIdentityRef(String identityNumber) {
        if (identityNumber == null || identityNumber.isEmpty())
            throw new BusinessException("Entrez un numéro d'identité valide");
        Customer customerFound = customerRepository.findByIdentityNumber(identityNumber)
                .orElseThrow(() -> new BusinessException(String.format("Aucun client avec le numéro d'identité %s n'existe", identityNumber)));
        customerRepository.delete(customerFound);
        return String.format("Client avec le numéro d'identité %s supprimé avec succès", identityNumber);
    }

    private String generateUsername(String firstname, String lastname) {
        String base = (firstname.substring(0, 1) + lastname).toLowerCase().replaceAll("\\s+", "");
        String username = base;
        int counter = 1;
        while (customerRepository.findByUsername(username).isPresent()) {
            username = base + counter++;
        }
        return username;
    }

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder password = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 12; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }

    /**
     * Validates that the person is at least 18 years old
     */
    private boolean isAtLeast18YearsOld(Date birthDate) {
        if (birthDate == null) {
            return false;
        }
        
        Calendar birthCal = Calendar.getInstance();
        birthCal.setTime(birthDate);
        
        Calendar today = Calendar.getInstance();
        
        // Calculate age
        int age = today.get(Calendar.YEAR) - birthCal.get(Calendar.YEAR);
        
        // Adjust if birthday hasn't occurred this year yet
        if (today.get(Calendar.DAY_OF_YEAR) < birthCal.get(Calendar.DAY_OF_YEAR)) {
            age--;
        }
        
        return age >= 18;
    }
}
