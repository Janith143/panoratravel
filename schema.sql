

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    destinations JSON,
    vehicleType VARCHAR(50),
    vehicleCount INT DEFAULT 1,
    passengers INT DEFAULT 1,
    startDate VARCHAR(50),
    contact JSON,
    addons JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    rating INT DEFAULT 5,
    text TEXT,
    trip VARCHAR(255),
    avatar VARCHAR(255),
    source VARCHAR(50) DEFAULT 'website',
    isFeatured BOOLEAN DEFAULT FALSE,
    image VARCHAR(255),
    photos JSON,
    categories JSON, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery_images (
    id VARCHAR(50) PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    category VARCHAR(50),
    width INT,
    height INT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    description TEXT,
    image VARCHAR(255),
    category VARCHAR(100),
    district VARCHAR(100),
    highlights JSON,
    mapData JSON,
    categories JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tours Table
CREATE TABLE IF NOT EXISTS tours (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE,
    title VARCHAR(255),
    duration VARCHAR(50),
    price VARCHAR(50),
    image VARCHAR(255),
    category VARCHAR(100),
    rating FLOAT DEFAULT 5.0,
    reviews INT DEFAULT 0,
    description TEXT,
    highlights JSON,
    itinerary JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE,
    title VARCHAR(255),
    excerpt TEXT,
    content TEXT,
    image VARCHAR(255),
    author VARCHAR(100),
    date DATETIME,
    category VARCHAR(50),
    readTime VARCHAR(20),
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQ Table
CREATE TABLE IF NOT EXISTS faq (
    id VARCHAR(50) PRIMARY KEY,
    question TEXT,
    answer TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Config Table
CREATE TABLE IF NOT EXISTS site_config (
    id VARCHAR(50) PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE,
    value JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fleet Table
CREATE TABLE IF NOT EXISTS fleet (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(50),
    passengers INT,
    price INT,
    additionalKmRate INT DEFAULT 0,
    image VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
