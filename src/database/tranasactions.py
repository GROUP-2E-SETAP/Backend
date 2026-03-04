def get_financial_summary(conn, user_id):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT
                u.name,
                COALESCE(SUM(t.amount) FILTER (WHERE c.type = 'income'), 0) AS total_income,
                COALESCE(SUM(t.amount) FILTER (WHERE c.type = 'expense'), 0) AS total_expenses,
                COALESCE(SUM(t.amount) FILTER (WHERE c.type = 'income'), 0) -
                COALESCE(SUM(t.amount) FILTER (WHERE c.type = 'expense'), 0) AS savings
            FROM users u
            LEFT JOIN transactions t ON t.user_id = u.id
            LEFT JOIN categories c ON c.id = t.category_id
            WHERE u.id = %s
            GROUP BY u.id, u.name
        """, (user_id,))
        return cur.fetchone()

def get_all_transactions(conn, user_id):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT t.id, t.transaction_date, c.name AS category,
                   c.type, t.amount, t.description
            FROM transactions t
            LEFT JOIN categories c ON c.id = t.category_id
            WHERE t.user_id = %s
            ORDER BY t.transaction_date DESC
        """, (user_id,))
        return cur.fetchall()

def delete_transaction(conn, user_id, transaction_id):
    with conn.cursor() as cur:
        cur.execute("""
            DELETE FROM transactions
            WHERE id = %s AND user_id = %s
        """, (transaction_id, user_id))
        conn.commit()

def delete_all_transactions(conn, user_id):
    with conn.cursor() as cur:
        cur.execute("""
            DELETE FROM transactions
            WHERE user_id = %s
        """, (user_id,))
        conn.commit()