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
values ("Security"),("Critical");

insert into product (product)
values ("Server 2019"),("Server 2016"),("Server 2012"),("Server 2008"),("Windows 10 1607"),("Windows 10 1803"),("Windows 10 1903"),("Windows 7"),("Office 2010"),("Office 2013");

insert into status (status)
values ("Unapproved"),("Approved"),("Declined");

insert into wupdate (kb, url, details, publishDate, status_id, classification_id, product_id)
values
(2850016, 
"https://support.microsoft.com/en-us/help/2850016/ms13-106-description-of-the-security-update-for-office-2010-december-1",
"Add first data to table","12/10/2010",1,1,6);


-- test query
select u.kb as KBArticle, u.details as Details, s.status as Status, c.classification as Classification 
from wupdate u
join status s on u.status_id = s.id
join classification c on u.classification_id = c.id;

select * from classification;

insert into product (product)
values ("Windows 7"), ("Server 2008");
select * from product;