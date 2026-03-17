-- Create a new database
CREATE DATABASE LibraryDB;

-- Switch to the new database
USE LibraryDB;

-- Create Authors table
CREATE TABLE Authors (
    AuthorID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    BirthDate DATE,
    Nationality VARCHAR(50)
);

-- Create Books table
CREATE TABLE Books (
    BookID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(200) NOT NULL,
    Genre VARCHAR(100),
    PublicationYear INT,
    AuthorID INT,
    FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID) ON DELETE SET NULL
);

-- Create Borrowers table
CREATE TABLE Borrowers (
    BorrowerID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    PhoneNumber VARCHAR(15)
);

-- Create Loans table (many-to-many relationship between Books and Borrowers)
CREATE TABLE Loans (
    LoanID INT PRIMARY KEY AUTO_INCREMENT,
    BorrowerID INT,
    BookID INT,
    LoanDate DATE NOT NULL,
    ReturnDate DATE,
    FOREIGN KEY (BorrowerID) REFERENCES Borrowers(BorrowerID) ON DELETE CASCADE,
    FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE
);

-- Example of inserting data into Authors
INSERT INTO Authors (FirstName, LastName, BirthDate, Nationality)
VALUES ('George', 'Orwell', '1903-06-25', 'British'),
       ('J.K.', 'Rowling', '1965-07-31', 'British');

-- Example of inserting data into Books
INSERT INTO Books (Title, Genre, PublicationYear, AuthorID)
VALUES ('1984', 'Dystopian', 1949, 1),
       ('Harry Potter and the Philosopher\'s Stone', 'Fantasy', 1997, 2);

-- Example of inserting data into Borrowers
INSERT INTO Borrowers (FirstName, LastName, Email, PhoneNumber)
VALUES ('John', 'Doe', 'john.doe@example.com', '123-456-7890'),
       ('Jane', 'Smith', 'jane.smith@example.com', '987-654-3210');

-- Example of inserting data into Loans
INSERT INTO Loans (BorrowerID, BookID, LoanDate, ReturnDate)
VALUES (1, 1, '2024-01-15', '2024-02-15'),
       (2, 2, '2024-01-20', '2024-02-20');
