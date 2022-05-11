INSERT INTO department
    (department_name)
VALUES  
    ('Office Personel'),
    ('Client Liason'),
    ('Stenographer'),
    ('Executive');

INSERT INTO role
    (title, salary, department_id)
VALUES  
   ('Office Manager', 62000, 1),
   ('Proofreader', 54000, 1),
   ('Client Sales', 78000, 2),
   ('Client Relations', 81000, 2),
   ('Court Reporter', 140000, 3), 
   ('CART Provider', 140000, 3),
   ('Vice President of Operations', 270000, 4),
   ('CEO', 320000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Smith', 1, NULL),
    ('Jessica', 'Johnson', 2, NULL),
    ('Jacob', 'Manning', 3, 1),
    ('Janet', 'Rogers', 4, 2),
    ('Heather', 'Qurshi', 5, NULL),
    ('Jennie', 'Mauch', 6, NULL),
    ('Jamie', 'White', 7, 4),
    ('Shawn', 'Moran', 8, 5);