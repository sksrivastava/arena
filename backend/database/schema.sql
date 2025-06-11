-- Decentralized Social Media Database Schema

-- Create database (run this separately)
-- CREATE DATABASE decentral_social;

-- Users table
CREATE TABLE users (
    wallet_address VARCHAR(42) PRIMARY KEY,
    username VARCHAR(50),
    bio VARCHAR(500),
    profile_pic_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(42) NOT NULL,
    content TEXT NOT NULL CHECK (LENGTH(content) <= 280),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_address) REFERENCES users(wallet_address) ON DELETE CASCADE
);

-- Likes table (composite primary key)
CREATE TABLE likes (
    post_id INTEGER NOT NULL,
    wallet_address VARCHAR(42) NOT NULL,
    PRIMARY KEY (post_id, wallet_address),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_address) REFERENCES users(wallet_address) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    wallet_address VARCHAR(42) NOT NULL,
    content TEXT NOT NULL CHECK (LENGTH(content) <= 500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_address) REFERENCES users(wallet_address) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_posts_wallet_address ON posts(wallet_address);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_wallet_address ON comments(wallet_address);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_wallet_address ON likes(wallet_address); 