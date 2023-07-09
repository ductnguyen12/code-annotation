package com.ntd.unipassau.codeannotation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "users")
@Setter
@Getter
@ToString
@JsonIgnoreProperties({"password"})
public class User extends AbstractAuditingEntity<UUID> {
    @Id
    @GeneratedValue
    private UUID id;
    private String username;
    private String password;
    private String name;
    private boolean enabled;
    private Boolean superAdmin;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(getId(), user.getId());
    }
}
