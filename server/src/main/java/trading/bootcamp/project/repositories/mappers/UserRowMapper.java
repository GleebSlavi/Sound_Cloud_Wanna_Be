package trading.bootcamp.project.repositories.mappers;

import org.springframework.jdbc.core.RowMapper;
import trading.bootcamp.project.repositories.entities.UserEntity;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

public class UserRowMapper implements RowMapper<UserEntity> {
    @Override
    public UserEntity mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        LocalDate subscriptionEndDate = resultSet.getDate("subscription_end_date") == null
                ? null
                : resultSet.getDate("subscription_end_date").toLocalDate();
        return new UserEntity(
                UUID.fromString(resultSet.getString("id")),
                resultSet.getString("username"),
                resultSet.getString("email"),
                resultSet.getString("password"),
                resultSet.getDate("create_date").toLocalDate(),
                resultSet.getString("image_url"),
                resultSet.getBoolean("is_premium"),
                resultSet.getInt("left_songs"),
                subscriptionEndDate
        );
    }
}
