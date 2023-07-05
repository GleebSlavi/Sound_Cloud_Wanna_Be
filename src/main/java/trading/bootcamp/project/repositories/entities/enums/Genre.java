package trading.bootcamp.project.repositories.entities.enums;

import org.w3c.dom.html.HTMLOptGroupElement;

public enum Genre {

    POP("Pop"),
    RAP("Hip-Hop/Rap"),
    R_AND_B("R&B"),
    ROCK("Rock"),
    METAL("Metal"),
    ELECTRONIC_DANCE("Electronic Dance"),
    JAZZ("Jazz"),
    LATIN("Latin"),
    POP_FOLK("Pop-Folk");

    private String genre;

    Genre(String genre) {
        this.genre = genre;
    }

    public String getGenre() {
        return genre;
    }

}
