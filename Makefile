

all:
	rm -rf tmp
	sc-build --languages=en --build=current --all -r

deploy:
	rsync -avz ./tmp/build/static root@d.whyville.net:/disk2/wv-d238/html/
	rsync -avz ./tmp/build/static/lab root@d.whyville.net:/disk2/wv-d238/html/

