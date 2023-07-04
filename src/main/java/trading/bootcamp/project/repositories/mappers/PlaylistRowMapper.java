package trading.bootcamp.project.repositories.mappers;

import org.springframework.jdbc.core.RowMapper;
import trading.bootcamp.project.repositories.entities.PlaylistEntity;
import trading.bootcamp.project.repositories.entities.enums.Type;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class PlaylistRowMapper implements RowMapper<PlaylistEntity> {
    @Override
    public PlaylistEntity mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        return new PlaylistEntity(
                UUID.fromString(resultSet.getString("id")),
                UUID.fromString(resultSet.getString("user_id")),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getDate("create_date").toLocalDate(),
                Type.valueOf(resultSet.getString("type"))
        );
    }
}
