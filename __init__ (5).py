import pymysql

pymysql.install_as_MySQLdb()

# Django 6+ checks for MySQL 8.4+ by default; allow MySQL 8.0.x (found on system: 8.0.44)
from django.db.backends.base.base import BaseDatabaseWrapper
BaseDatabaseWrapper.check_database_version_supported = lambda self: None

from django.db.backends.mysql.features import DatabaseFeatures
DatabaseFeatures.minimum_database_version = (8, 0)
