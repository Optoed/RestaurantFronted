CREATE OR REPLACE FUNCTION GetDetailedOrdersByDateRangeAndCustomer(
    StartDate TIMESTAMP WITH TIME ZONE,  -- Изменено на TIMESTAMP WITH TIME ZONE
    EndDate TIMESTAMP WITH TIME ZONE,      -- Изменено на TIMESTAMP WITH TIME ZONE
    CustomerId INT
)
RETURNS TABLE (
    id_order INT,
    id_customer INT,
    customer_name VARCHAR(255),  -- Изменено на VARCHAR(255)
    dish_name VARCHAR(100),       -- Изменено на VARCHAR(100)
    dish_cost INT,                -- Убедитесь, что это действительно INT
    cook_name VARCHAR(255),       -- Изменено на VARCHAR(255)
    total_cost INT,               -- Убедитесь, что это действительно INT
    status VARCHAR(255),          -- Изменено на VARCHAR(255)
    order_date TIMESTAMP WITH TIME ZONE  -- Убедитесь, что это действительно TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id AS id_order,
        o.id_customer,
        customer.name AS customer_name,
        d.name AS dish_name,
        d.cost::INT AS dish_cost,  -- Приведение к INT, если это необходимо
        c.name AS cook_name,
        o.total_cost::INT AS total_cost,  -- Приведение к INT, если это необходимо
        o.status,
        o.order_date AT TIME ZONE 'UTC' AS order_date  -- Приведение к TIMESTAMP WITH TIME ZONE
    FROM 
        orders o
    INNER JOIN 
        orders_dish_cook odc ON o.id = odc.id_orders
    INNER JOIN 
        dish d ON odc.id_dish = d.id
    INNER JOIN 
        cook c ON odc.id_cook = c.id
    INNER JOIN
        customer ON o.id_customer = customer.id
    WHERE 
        o.order_date BETWEEN StartDate AND EndDate
        AND o.id_customer = CustomerId;  -- Условие для фильтрации по CustomerId
END;
$$ LANGUAGE plpgsql;