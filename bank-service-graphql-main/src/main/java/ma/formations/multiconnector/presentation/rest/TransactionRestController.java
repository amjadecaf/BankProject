package ma.formations.multiconnector.presentation.rest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import ma.formations.multiconnector.common.CommonTools;
import ma.formations.multiconnector.dtos.transaction.AddWirerTransferRequest;
import ma.formations.multiconnector.dtos.transaction.AddWirerTransferResponse;
import ma.formations.multiconnector.dtos.transaction.GetTransactionListRequest;
import ma.formations.multiconnector.dtos.transaction.TransactionDto;
import ma.formations.multiconnector.dtos.transfer.TransferRequest;
import ma.formations.multiconnector.dtos.transfer.TransferResponse;
import ma.formations.multiconnector.service.ITransactionService;
import ma.formations.multiconnector.service.ITransferService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@AllArgsConstructor
@RestController
@RequestMapping("/api/rest/transaction")
@CrossOrigin("http://localhost:3000/")
public class TransactionRestController {
    private ITransactionService transactionService;
    private ITransferService transferService;
    private CommonTools commonTools;
    @PostMapping("/create")
    public ResponseEntity<AddWirerTransferResponse> addWirerTransfer(@Valid @RequestBody
                                                                     AddWirerTransferRequest dto) {
        return new ResponseEntity<>(transactionService.wiredTransfer(dto), HttpStatus.CREATED);
    }
    @GetMapping
    public List<TransactionDto> getTransactions(GetTransactionListRequest dto) {
        return transactionService.getTransactions(dto);
    }
    
    @PostMapping("/transfer")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<TransferResponse> transfer(@Valid @RequestBody TransferRequest request,
                                                     Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(transferService.executeTransfer(request, username));
    }
}