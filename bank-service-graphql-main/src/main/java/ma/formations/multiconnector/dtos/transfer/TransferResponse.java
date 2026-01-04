package ma.formations.multiconnector.dtos.transfer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferResponse {
    private boolean success;
    private String message;
    private Long debitTransactionId;
    private Long creditTransactionId;
}
