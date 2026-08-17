INSERT INTO [dbo].[user] (
    [id],
    [role],
    [email],
    [password],
    [phone],
    [name],
    [ratingAverage],
    [ratingCount]
)
VALUES
-- u1 (Emma - hirer)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 'hirer',
 'emma.hirer@example.com',
 'hirer123',
 '',
 '',
 0,
 0),

-- u2 (Liam - vendor)
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
 'vendor',
 'liam.vendor@example.com',
 'vendor123',
 '',
 '',
 0,
 0),

-- u3 (Olivia - hirer)
('cccccccc-cccc-cccc-cccc-cccccccccccc',
 'hirer',
 'olivia.hirer@example.com',
 'hirer456',
 '',
 '',
 0,
 0),

-- u4 (Dana - vendor)
('dddddddd-dddd-dddd-dddd-dddddddddddd',
 'vendor',
 'dana.vendor@example.com',
 'vendor456',
 '',
 '',
 0,
 0),

-- u5 (Timothee - vendor)
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
 'vendor',
 'timothee.vendor@example.com',
 'vendor789',
 '',
 '',
 0,
 0);