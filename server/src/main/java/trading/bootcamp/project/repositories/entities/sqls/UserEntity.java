package trading.bootcamp.project.repositories.entities.sqls;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import trading.bootcamp.project.repositories.entities.enums.Role;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Data
public class UserEntity implements UserDetails {

    private final UUID id;

    private final String username;

    private final String email;

    private final String password;

    private final LocalDate createDate;

    private final String imageUrl;

    private final Role role;

    public UserEntity(UUID id, String username, String email,
                      String password, LocalDate createDate, String imageUrl) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.createDate = createDate;
        this.imageUrl = imageUrl;
        role = Role.USER;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
