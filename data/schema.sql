CREATE TABLE sessions
(
  id          bigserial                NOT NULL,
  name        character varying        NOT NULL,
  description character varying        NOT NULL,
  room        character varying        NOT NULL,
  datetime    timestamp with time zone NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE speakers
(
  id          bigserial         NOT NULL,
  name        character varying NOT NULL,
  bio         character varying NOT NULL,
  email       character varying NOT NULL,
  picture_url character varying NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE sessions_speakers
(
  session_id bigserial NOT NULL,
  speaker_id bigserial NOT NULL,
  PRIMARY KEY (session_id, speaker_id)
);

ALTER TABLE sessions_speakers
  ADD CONSTRAINT FK_sessions_TO_sessions_speakers
    FOREIGN KEY (session_id)
    REFERENCES sessions (id);

ALTER TABLE sessions_speakers
  ADD CONSTRAINT FK_speakers_TO_sessions_speakers
    FOREIGN KEY (speaker_id)
    REFERENCES speakers (id);