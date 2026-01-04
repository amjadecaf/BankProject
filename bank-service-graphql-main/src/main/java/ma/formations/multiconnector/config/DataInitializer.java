package ma.formations.multiconnector.config;

import lombok.AllArgsConstructor;
import ma.formations.multiconnector.dao.BankAccountRepository;
import ma.formations.multiconnector.dao.CustomerRepository;
import ma.formations.multiconnector.dao.RoleRepository;
import ma.formations.multiconnector.dao.UserRepository;
import ma.formations.multiconnector.enums.AccountStatus;
import ma.formations.multiconnector.service.model.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;

@Configuration
@AllArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final BankAccountRepository bankAccountRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            // Create roles if they don't exist
            Role clientRole = roleRepository.findByAuthority("ROLE_CLIENT")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setAuthority("ROLE_CLIENT");
                        return roleRepository.save(role);
                    });

            Role agentRole = roleRepository.findByAuthority("ROLE_AGENT_GUICHET")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setAuthority("ROLE_AGENT_GUICHET");
                        return roleRepository.save(role);
                    });

            // Create an agent user if not exists
            if (userRepository.findByUsername("agent1").isEmpty()) {
                Agent agent = new Agent();
                agent.setUsername("agent1");
                agent.setPassword(passwordEncoder.encode("agent123"));
                agent.setFirstname("Agent");
                agent.setLastname("Guichet");
                agent.setEmail("agent1@cafbattalbank.ma");
                agent.setEnabled(true);
                agent.setAccountNonExpired(true);
                agent.setAccountNonLocked(true);
                agent.setCredentialsNonExpired(true);
                agent.getAuthorities().add(agentRole);
                userRepository.save(agent);
                System.out.println("Agent user created: agent1 / agent123");
            }

            // Create a test client if not exists
            if (customerRepository.findByUsername("aclient").isEmpty()) {
                Customer client = new Customer();
                client.setUsername("aclient");
                client.setPassword(passwordEncoder.encode("client123"));
                client.setFirstname("Amjade");
                client.setLastname("CAF");
                client.setEmail("amjade.caf@example.com");
                client.setIdentityNumber("ID123456");
                client.setBirthDate(new Date());
                client.setPostalAddress("123 Rue Principale, Casablanca");
                client.setEnabled(true);
                client.setAccountNonExpired(true);
                client.setAccountNonLocked(true);
                client.setCredentialsNonExpired(true);
                client.getAuthorities().add(clientRole);
                Customer savedClient = customerRepository.save(client);

                // Create a bank account for the test client
                BankAccount account1 = BankAccount.builder()
                        .rib("MA001234567890123456789012")
                        .amount(5000.0)
                        .accountStatus(AccountStatus.OPENED)
                        .customer(savedClient)
                        .createdAt(new Date())
                        .build();
                bankAccountRepository.save(account1);

                BankAccount account2 = BankAccount.builder()
                        .rib("MA009876543210987654321098")
                        .amount(2000.0)
                        .accountStatus(AccountStatus.OPENED)
                        .customer(savedClient)
                        .createdAt(new Date())
                        .build();
                bankAccountRepository.save(account2);

                System.out.println("Test client created: aclient / client123");
                System.out.println("Bank accounts created: MA001234567890123456789012, MA009876543210987654321098");
            }

            // Create another test client
            if (customerRepository.findByUsername("mbattal").isEmpty()) {
                Customer client2 = new Customer();
                client2.setUsername("mbattal");
                client2.setPassword(passwordEncoder.encode("client456"));
                client2.setFirstname("Mohammed Othmane");
                client2.setLastname("BATTAL");
                client2.setEmail("mohammed.battal@example.com");
                client2.setIdentityNumber("ID789012");
                client2.setBirthDate(new Date());
                client2.setPostalAddress("456 Avenue Hassan II, Rabat");
                client2.setEnabled(true);
                client2.setAccountNonExpired(true);
                client2.setAccountNonLocked(true);
                client2.setCredentialsNonExpired(true);
                client2.getAuthorities().add(clientRole);
                Customer savedClient2 = customerRepository.save(client2);

                // Create a bank account
                BankAccount account3 = BankAccount.builder()
                        .rib("MA005555555555555555555555")
                        .amount(10000.0)
                        .accountStatus(AccountStatus.OPENED)
                        .customer(savedClient2)
                        .createdAt(new Date())
                        .build();
                bankAccountRepository.save(account3);

                System.out.println("Test client created: mbattal / client456");
                System.out.println("Bank account created: MA005555555555555555555555");
            }

            System.out.println("\n========================================");
            System.out.println("CAF Amjade & BATTAL Mohammed Othmane Bank");
            System.out.println("Test Data Initialized Successfully");
            System.out.println("========================================\n");
        };
    }
}
