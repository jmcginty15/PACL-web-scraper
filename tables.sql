USE pacl;
GO

DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS sections;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS clubs;
DROP TABLE IF EXISTS members;
GO

CREATE TABLE clubs (
    id BIGINT PRIMARY KEY,
    name TEXT
);
GO

INSERT INTO clubs (id) VALUES (0);

CREATE TABLE members (
    id BIGINT PRIMARY KEY,
    name TEXT,
    -- prefix TEXT,
    -- firstName TEXT,
    -- middleName TEXT,
    -- lastName TEXT,
    state TEXT,
    gender TEXT,
    expDate TEXT,
    lastChangeDate TEXT,
    FIDEID BIGINT,
    FIDECountry TEXT,
    overallRank TEXT,
    seniorRank TEXT,
    juniorRank TEXT,
    femaleRank TEXT,
    stateRank TEXT,
    ratingBlitz TEXT,
    ratingQuick TEXT,
    ratingRegular TEXT,
    ratingBlitzOnline TEXT,
    ratingQuickOnline TEXT,
    ratingRegularOnline TEXT,
    ratingCorrespondence TEXT
);
GO

INSERT INTO members (id) VALUES (0);

CREATE TABLE events (
    id BIGINT PRIMARY KEY,
    name TEXT,
    locationCity TEXT,
    locationZip TEXT,
    dates TEXT,
    sponsoringClub BIGINT FOREIGN KEY REFERENCES clubs ON DELETE CASCADE,
    chiefTd BIGINT FOREIGN KEY REFERENCES members ON DELETE CASCADE,
    sections INT,
    players INT
);
GO

CREATE TABLE sections (
    event BIGINT FOREIGN KEY REFERENCES events ON DELETE CASCADE,
    id INT NOT NULL,
    name TEXT,
    dates TEXT,
    chiefTd BIGINT FOREIGN KEY REFERENCES members ON DELETE NO ACTION,
    rounds INT,
    players INT,
    kFactor TEXT,
    ratingSys TEXT,
    tournamentType TEXT,
    timeControl TEXT,

    CONSTRAINT PK_section PRIMARY KEY (event, id)
);
GO

CREATE TABLE entries (
    event BIGINT,
    section INT,
    player BIGINT,
    pairingNum INT,
    score FLOAT,
    ratingBefore TEXT,
    ratingAfter TEXT,
    ratingDualBefore TEXT,
    ratingDualAfter TEXT,

    CONSTRAINT PK_entries PRIMARY KEY (event, section, player),
    CONSTRAINT FK_entries FOREIGN KEY (event, section) REFERENCES sections (event, id) 
);
GO

CREATE TABLE games (
    event BIGINT,
    section INT,
    round INT,
    white BIGINT FOREIGN KEY REFERENCES members ON DELETE NO ACTION,
    black BIGINT FOREIGN KEY REFERENCES members ON DELETE NO ACTION,
    colorsReported BIT,
    result TEXT,

    CONSTRAINT PK_games PRIMARY KEY (event, section, round, white, black)
);
GO

-- SELECT * FROM members;
-- GO