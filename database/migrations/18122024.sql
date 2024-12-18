CREATE TABLE Consultation (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Recording (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES Consultation(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    mimetype VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Transcription (
    id SERIAL PRIMARY KEY,
    recording_id INTEGER REFERENCES Recording(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Note (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL DEFAULT '',
    consultation_id INTEGER UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_consultation
        FOREIGN KEY(consultation_id) 
            REFERENCES consultation(id)
            ON DELETE CASCADE
);

CREATE TABLE ConsultationNote (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER NOT NULL UNIQUE,
    generated_content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_consultation
        FOREIGN KEY (consultation_id)
        REFERENCES consultation(id)
        ON DELETE CASCADE
);