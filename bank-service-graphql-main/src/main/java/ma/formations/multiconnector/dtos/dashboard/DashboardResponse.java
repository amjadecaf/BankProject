package ma.formations.multiconnector.dtos.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.formations.multiconnector.dtos.transaction.TransactionDto;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private List<AccountSummary> accounts;
    private String selectedRib;
    private Double selectedAccountBalance;
    private List<TransactionDto> recentTransactions;
    private int totalPages;
    private long totalTransactions;
}
