package ma.formations.multiconnector.dtos.customer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class AddCustomerRequest {
    private String firstname;
    private String lastname;
    private String identityNumber;
    private Date birthDate;
    private String email;
    private String postalAddress;
}
