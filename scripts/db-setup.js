const mysql = require('mysql2/promise');

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
  });

  try {
    console.log('🔌 Connected to MySQL server.');

    await connection.query('CREATE DATABASE IF NOT EXISTS panora_paths');
    console.log('✅ Database `panora_paths` ensures.');

    await connection.query('USE panora_paths');

    // Create Inquiries Table
    await connection.query(`
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
      )
    `);
    console.log('✅ Table `inquiries` ready.');

    // Create Reviews Table
    await connection.query(`
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
      )
    `);
    console.log("Checked/Created 'reviews' table");

    // Create Gallery Table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS gallery_images (
          id VARCHAR(50) PRIMARY KEY,
          url VARCHAR(255) NOT NULL,
          title VARCHAR(255),
          category VARCHAR(50),
          width INT,
          height INT,
          featured BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    console.log('✅ Table `gallery_images` ready.');

    // Create Destinations Table (Simplified for brevity, can expand columns as needed)
    await connection.query(`
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
      )
    `);
    console.log('✅ Table `destinations` ready.');

    // Create Tours Table
    await connection.query(`
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
      )
    `);
    console.log('✅ Table `tours` ready.');

    // Create Blog Posts Table
    await connection.query(`
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
      )
    `);
    console.log('✅ Table `posts` ready.');

    // Create FAQ Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS faq (
        id VARCHAR(50) PRIMARY KEY,
        question TEXT,
        answer TEXT,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table `faq` ready.');

    // Create Site Config Table (Key-Value store)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_config (
        id VARCHAR(50) PRIMARY KEY,
        section_key VARCHAR(100) UNIQUE, -- e.g. 'hero', 'contact'
        value JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table `site_config` ready.');



    console.log('🎉 Database setup complete!');
  } catch (err) {
    console.error('❌ Error creating database:', err);
  } finally {
    await connection.end();
  }
}

setupDatabase();
