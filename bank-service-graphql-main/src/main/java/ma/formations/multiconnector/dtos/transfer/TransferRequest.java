package ma.formations.multiconnector.dtos.transfer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequest {
    private String sourceRib;
    private String destinationRib;
    private Double amount;
    private String motif;
}
