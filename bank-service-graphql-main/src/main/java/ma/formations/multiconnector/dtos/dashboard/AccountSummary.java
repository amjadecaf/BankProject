package ma.formations.multiconnector.dtos.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountSummary {
    private String rib;
    private Double balance;
    private Date lastTransactionDate;
}
