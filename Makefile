SHELL=/bin/bash
UID=$(shell echo $${UID})
HOMEDIR=$(shell echo $${HOME})

os_adjust = $(if $(filter $(OS),Windows_NT),$(subst /,\\\\,$1),$1)

default: cov

clean:
	rm -f coverage.html results.xml
	rm -rf node_modules logs pkg
	rm -f package-lock.json

prepare: clean
	mkdir -p logs
	npm install

prepare-prod: clean
	npm install --productiond


test:
	make -k wrapped-test
wrapped-test: real-test
real-test:
	.$(call os_adjust,/node_modules/.bin/lab) -a -v code --leaks 

test-watch:
	nodemon --watch lib --watch test -- ./node_modules/.bin/lab -a code --leaks

spec:
	make -k wrapped-spec
wrapped-spec: real-spec
real-spec:
	.$(call os_adjust,/node_modules/.bin/lab) -v -a code --leaks 

spec-watch:
	nodemon --watch lib --watch test -- ./node_modules/.bin/lab -v -a code --leaks

cov:
	make -k wrapped-cov
wrapped-cov: real-cov-threshold
real-cov-threshold:
	.$(call os_adjust,/node_modules/.bin/lab) -t 100 -v -a code --leaks 

cov-watch:
	nodemon --watch lib --watch test -- ./node_modules/.bin/lab -t 100 -a code --leaks

report: real-cov-report
real-cov-report:
	rm -fv coverage.html
	.$(call os_adjust,/node_modules/.bin/lab) -r console -o stdout -r html -t 100 -o coverage.html -a code --leaks 

spec-cov:
	make -k wrapped-spec-cov
wrapped-spec-cov: real-spec-cov
real-spec-cov:
	.$(call os_adjust,/node_modules/.bin/lab) -v -t 100 -a code --leaks 
spec-cov-watch:
	nodemon --watch lib --watch test -- ./node_modules/.bin/lab -v -t 100 -a code --leaks

lint:
	.$(call os_adjust,/node_modules/.bin/eslint) .

complexity:
	.$(call os_adjust,/node_modules/.bin/cr) --minmi 20 --maxcyc 10 --maxhd 20 -n --silent ./lib || true

complexity-report:
	.$(call os_adjust,/node_modules/.bin/cr) --minmi 20 --maxcyc 10 --maxhd 20 -n ./lib

doc:
	.$(call os_adjust,/node_modules/.bin/jsdoc) -c .jsdoc.json

package: prepare
	npm prune --production
	mkdir -p pkg
	tar pczf pkg/test.tar.gz --exclude-tag-all=test.tar.gz --exclude .git/ .

publish: prepare
	npm pack
	npm publish