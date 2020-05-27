drop database if exists WSUS_UP;
create database WSUS_UP;
use WSUS_UP;

create table status (
	id int auto_increment not null,
    status varchar(40) not null,
    primary key (id)
);

create table classification (
	id int auto_increment not null,
    classification varchar(100),
    primary key (id)
);

create table product (
	id int auto_increment not null,
    product varchar(100) not null,
    primary key (id)
);

create table wupdate (
	id INT AUTO_INCREMENT not null,
    kb INT not null,
    url VARCHAR(200) default '',
    details VARCHAR(250) default '',
    publishDate DATE,
    researchDate TIMESTAMP default current_timestamp,
    status_id int not null,
    classification_id int not null,
    product_id int not null,
    foreign key (status_id) references status(id),
    foreign key (classification_id) references classification(id),
    foreign key (product_id) references product(id),
    primary key (id)
);


-- seed tables
insert into classification (classification)
values ("Security"),("Critical"),("Updates"),("Upgrades");

insert into product (product)
values ("Server 2019"),("Server 2016"),("Server 2012"),("Server 2012 R2"),("Server 2008"),("Server 2008 R2"),
	("Windows 10 1607"),("Windows 10 1709"),("Windows 10 1803"),("Windows 10 1903"),("Windows 7"),
    ("Office 2010"),("Office 2013");

insert into status (status)
values ("Unapproved"),("Approved"),("Declined"),("Superseded");

-- test query
select u.id as uid, u.kb as KBArticle, u.details as Details, s.status as Status, c.classification as Classification, 
	u.publishDate as PublishDate, p.product as Product, u.url as URL
        from wupdate u
        join status s on u.status_id = s.id
        join classification c on u.classification_id = c.id
        join product p on u.product_id = p.id
order by KB desc;

-- bulk insert
insert into wupdate (
	kb, classification_id, status_id, details, product_id, publishDate, url) 
	values ('4549951', 1, 3, 'Superseded by 4556799', 10, '2020-04-14', ''),
    ('4549949', 1, 2, '', 1, '2020-04-14', '');

-- filter query
select u.id as uid, u.kb as KBArticle, u.details as Details, s.status as Status, c.classification as Classification, u.publishDate as PublishDate, p.product as Product, u.url as URL
        from wupdate u
        join status s on u.status_id = s.id
        join classification c on u.classification_id = c.id
        join product p on u.product_id = p.id
        where status = "declined"
order by KB desc;

select u.id as uid, u.kb as KBArticle, u.details as Details, s.status as Status, c.classification as Classification, 
	   u.publishDate as PublishDate, u.researchDate as ResearchDate, p.product as Product, u.url as URL
        from wupdate u
        join status s on u.status_id = s.id
        join classification c on u.classification_id = c.id
        join product p on u.product_id = p.id
        where u.kb like "1171%"
order by KB desc;

-- delete
DELETE FROM wupdate 
WHERE wupdate.id = 17;