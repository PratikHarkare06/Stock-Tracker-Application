# PostgreSQL Database Schema for Stock Tracker Application

## Tables

### stocks
| Column | Type | Constraints |
|--------|------|-------------|
| id | VARCHAR(255) | PRIMARY KEY |
| symbol | VARCHAR(50) | NOT NULL |
| name | VARCHAR(255) | NOT NULL |
| price | DECIMAL(10,2) | NOT NULL |
| market_cap | BIGINT | NOT NULL |
| sector | VARCHAR(100) | NOT NULL |
| price_change_direction | VARCHAR(10) | NULL |

### mutual_funds
| Column | Type | Constraints |
|--------|------|-------------|
| id | VARCHAR(255) | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| amc | VARCHAR(255) | NOT NULL |
| category | VARCHAR(100) | NOT NULL |

### fund_holdings
| Column | Type | Constraints |
|--------|------|-------------|
| fund_id | VARCHAR(255) | FOREIGN KEY (mutual_funds.id) |
| stock_id | VARCHAR(255) | FOREIGN KEY (stocks.id) |
| percentage | DECIMAL(5,2) | NOT NULL |

### indices
| Column | Type | Constraints |
|--------|------|-------------|
| id | VARCHAR(255) | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| value | DECIMAL(12,2) | NOT NULL |
| change | DECIMAL(12,2) | NOT NULL |
| percent_change | DECIMAL(5,2) | NOT NULL |

### bot_logs
| Column | Type | Constraints |
|--------|------|-------------|
| id | VARCHAR(255) | PRIMARY KEY |
| bot_name | VARCHAR(255) | NOT NULL |
| status | VARCHAR(20) | NOT NULL |
| execution_time | DECIMAL(10,2) | NOT NULL |
| timestamp | TIMESTAMP | NOT NULL |
| result | TEXT | NULL |

## Relationships
- fund_holdings.fund_id references mutual_funds.id
- fund_holdings.stock_id references stocks.id