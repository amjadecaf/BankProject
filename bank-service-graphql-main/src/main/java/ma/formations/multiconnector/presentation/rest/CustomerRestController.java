package ma.formations.multiconnector.presentation.rest;
import jakarta.validation.Valid;
import ma.formations.multiconnector.dtos.customer.*;
import ma.formations.multiconnector.service.ICustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/rest/customer")
@CrossOrigin("http://localhost:3000/")
public class CustomerRestController {
    private final ICustomerService customerService;
    public CustomerRestController(ICustomerService customerService) {
        this.customerService = customerService;
    }
    @GetMapping("/all")
    List<CustomerDto> customers() {
        return customerService.getAllCustomers();
    }
    @GetMapping
    CustomerDto customerByIdentity(@RequestParam(value = "identity") String identity) {
        return customerService.getCustomByIdentity(identity);
    }
    @PostMapping("/create")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<AddCustomerResponse> createCustomer(@RequestBody @Valid AddCustomerRequest dto) {
        return new ResponseEntity<>(customerService.createCustomer(dto), HttpStatus.CREATED);
    }
    @PutMapping("/update/{identityRef}")
    public ResponseEntity<UpdateCustomerResponse> updateCustomer(@PathVariable String identityRef, @RequestBody
    @Valid UpdateCustomerRequest dto) {
        return new ResponseEntity<>(customerService.updateCustomer(identityRef, dto), HttpStatus.OK);
    }
    @DeleteMapping("/delete/{identityRef}")
    public ResponseEntity<String> deleteCustomer(@PathVariable String identityRef) {
        customerService.deleteCustomerByIdentityRef(identityRef);
        return new ResponseEntity<>(String.format("Customer with identity %s is removed", identityRef), HttpStatus.OK);
    }
}
