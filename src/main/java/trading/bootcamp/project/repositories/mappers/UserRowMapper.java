package trading.bootcamp.project.repositories.mappers;

import org.springframework.jdbc.core.RowMapper;
import trading.bootcamp.project.repositories.entities.UserEntity;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class UserRowMapper implements RowMapper<UserEntity> {
    @Override
    public UserEntity mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        return new UserEntity(
                UUID.fromString(resultSet.getString("id")),
                resultSet.getString("username"),
                resultSet.getString("email"),
                resultSet.getString("password"),
                resultSet.getDate("create_date").toLocalDate(),
                resultSet.getString("image_url")
        );
    }
}
