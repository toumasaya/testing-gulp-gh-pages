# testing gulp-gh-pages

## 筆記

**1. 在 GitHub 建立一個空的 repo**

![](https://i.imgur.com/EAb7WRE.png)

**2. 把 GitHub 的 repo clone 到本機**

```shell
$ git clone https://github.com/toumasaya/testing-gulp-gh-pages.git
```

**3. 進入目錄，然後初始化 npm**

```shell
$ cd testing-gulp-gh-pages
$ npm init
```

**4. 安裝需要的 gulp plugin**

其中 `gulp-gh-pages` 就是讓最後輸出的檔案可以 deploy 到 GitHub

```shell
$ npm i --save-dev gulp gulp-pug del run-sequence gulp-gh-pages
```

**5. 建立 `gulpfile.js`**

```shell
$ touch gulpfile.js
```

```javascript
var gulp = require('gulp');
var pug = require('gulp-pug');
var del = require('del');
var runSequence  = require('run-sequence');
var ghPages = require('gulp-gh-pages');

// gh-pages
gulp.task('deploy', function() {
  return gulp.src('build/**/*')
    .pipe(ghPages());
});

// pug
gulp.task('pug', function(){
  return gulp.src(['app/pug/*.pug'])
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build/'))

});

// Cleaning
gulp.task('clean', function(){
  return del(['build/**/*']);
});

gulp.task('watch', function(){
  gulp.watch('app/pug/**/*.pug', ['pug']);
});

// Build Sequence
// -------------------

gulp.task('default', function(){
  runSequence('watch', ['pug']);
});

// 在執行 `gulp build` 時，也依序執行 deploy
// 不過 deploy 要放在最後面
// 要跟 build task 分開也可以，就是要另外執行 `gulp deploy`，看個人習慣
gulp.task('build', function(){
  runSequence('clean', ['pug'], 'deploy');
});
```

**6. 建立 `.gitignore`**

deploy 的過程中，會產生一個 `.publish` 的 cache 資料夾，這個也可以納入忽略清單。也可以忽略最終輸出的資料夾，此例是 `build/`，因為 `build` 會透過 `gh-pages` 分支進行 deploy。

```shell
$ touch .gitignore
```

```
# DS_Store
.DS_Store
app/.DS_Store

# Logs
*.log
logs

# Dependency directories
node_modules

# sass cache
.sass-cache
*.css.map

# .publish cache
.publish

# build dir
build
```

**7. push `master` branch**

準備好檔案之後，可以先 push `master` 分支到 GitHub

```shell
$ git add .
$ git commit -m "First commit"
$ git push
```

`push` 到 GitHub之後，目前只有 `master` 一個分支：

![](https://i.imgur.com/OOR9Q45.png)

**8. push `gh-pages` branch**

完整流程：

```shell
$ git checkout --orphan gh-pages
$ git rm -rf .
$ touch README.md
$ git add README.md
$ git commit -m "Init gh-pages"
$ git push --set-upstream origin gh-pages
$ git checkout master
```

---

```shell
// 建立一個沒有 parent 的 gh-pages 分支並且移到該分支上
$ git checkout --orphan gh-pages
```

如果此時查詢狀態，會發現 gh-pages 有之前的記錄：

![](https://i.imgur.com/cl4B5NZ.png)

所以要清除舊有的紀錄，保持 `gh-pages` 是乾淨的狀態：

```shell
// Remove all files from the old working tree
$ git rm -rf .
```

![](https://i.imgur.com/IJCb9Cq.png)


然後增加一些檔案，提交第一次紀錄，push 到 GitHub 上：

```shell
touch README.md
git add README.md
git commit -m "Init gh-pages"
git push --set-upstream origin gh-pages
git checkout master
```

`gh-pages` 分支成功 push 到 GitHub 上了！

![](https://i.imgur.com/hYsSjrw.png)

**9. 執行 deploy**

因為在我的 `gulpfile.js` 中，已經把 `deploy` task 綁進 `build` 任務裡面，所以只要執行 `gulp build` ，就會依序產生輸出檔案並且 deploy 到 GitHub 上：

```shell
$ gulp build
```

![](https://i.imgur.com/u26ZTla.png)

![](https://i.imgur.com/ITxP6eu.png)


最後就可以從 https://toumasaya.github.io/testing-gulp-gh-pages/ 看到靜態網頁了

---

[gulp-gh-pages](https://www.npmjs.com/package/gulp-gh-pages)

---

參考文章：
* [Deploying To Github Pages With Gulp](http://charliegleason.com/articles/deploying-to-github-pages-with-gulp)
* [建立自己的GitHub Project Pages](http://code.kpman.cc/2013/05/18/%E5%BB%BA%E7%AB%8B%E8%87%AA%E5%B7%B1%E7%9A%84github-project-pages/)
* [發布一個自己的網頁吧：github建立靜態網頁教學](http://boompie0715.blogspot.tw/2015/09/github.html)
* [Creating Project Pages using the command line](https://help.github.com/articles/creating-project-pages-using-the-command-line/)
* [User, Organization, and Project Pages](https://help.github.com/articles/user-organization-and-project-pages/#project-pages)
* [Configuring a publishing source for GitHub Pages](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/)
