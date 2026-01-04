package ma.formations.multiconnector.presentation.rest;

import lombok.AllArgsConstructor;
import ma.formations.multiconnector.dtos.dashboard.DashboardResponse;
import ma.formations.multiconnector.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rest/dashboard")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardRestController {

    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<DashboardResponse> getDashboard(
            Authentication authentication,
            @RequestParam(required = false) String rib,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        String username = authentication.getName();
        DashboardResponse dashboard = dashboardService.getDashboard(username, rib, page, size);
        return ResponseEntity.ok(dashboard);
    }
}
