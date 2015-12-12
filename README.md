# bookmarks
开启http和php服务即可。
ubuntu下安装可参考http://blog.csdn.net/hitabc141592/article/details/23556079。

#配置
安装完成后设置虚拟目录，之后需要在/etc/apache2/apache2.conf中加入

\<Directory 虚拟目录路径>

	Options Indexes FollowSymLinks
	
	AllowOverride None
	
	Require all granted
	
	allow from all
	
\</Directory>

\<Directory />中的Require all denied改为Require all granted

另外需要把源文件的mod改为可读写可执行
