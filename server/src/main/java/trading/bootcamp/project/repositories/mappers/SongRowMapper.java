package trading.bootcamp.project.repositories.mappers;

import org.springframework.jdbc.core.RowMapper;
import trading.bootcamp.project.repositories.entities.enums.SongType;
import trading.bootcamp.project.repositories.entities.SongEntity;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class SongRowMapper implements RowMapper<SongEntity> {
    @Override
    public SongEntity mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        return new SongEntity(
            UUID.fromString(resultSet.getString("id")),
            UUID.fromString(resultSet.getString("user_id")),
            resultSet.getString("name"),
            resultSet.getString("artist"),
            resultSet.getInt("release_year"),
                resultSet.getDouble("duration"),
            SongType.valueOf(resultSet.getString("type")),
            resultSet.getDate("upload_date").toLocalDate(),
            resultSet.getString("image_url"),
            resultSet.getString("cloud_url")
        );
    }
}
