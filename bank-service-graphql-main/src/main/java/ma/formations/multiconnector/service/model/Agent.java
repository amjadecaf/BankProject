package ma.formations.multiconnector.service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.*;

@Entity
@NoArgsConstructor
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "id")
public class Agent extends User {
    // Agent-specific fields can be added here if needed in the future
}
