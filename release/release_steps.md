# Steps to do before release

In the context of creating a release branch from *develop* and merging onto *master*

1. Start release branch in git
   1. Name should be "Release-N.N.N" (increment previous N by at least 1)
   2. Base should be from *develop*
2. Update package.json version number
   1. Should match the number in release branch name
3. Compile saD3.js (according to make file advised through main.js in main/dev/src)
   1. Make sure *not* to include test.js and main.js from /src
   2. Make sure to include license in compiled file
      1. merge.bat automates this process if you make sure every file matches those in main.js (minus test.js and main.js)
4. Minify saD3.js to update saD3.min.js
   1. Make sure to include license
   2. https://javascript-minifier.com/ is a good resource for this
5. Add /images folder at the same depth as the saD3.js file
6. Update docs
   1. By running make_doc.bat in /docs
7. Git commit changes
   1. Preferably one at a time
8. Test the demo .html files to make sure they are error free
9. wrap saD3.js, saD3.min.js, and images into a folder in /release titled /saD3_N.N.N
10. Finish Release in Git
   1. Rebase *develop* branch from *master* to make sure everything is up to date
