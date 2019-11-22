# Steps to do before release

In the context of creating a release branch from *develop* and merging onto *master*

1. Start release branch in git
   1. Name should be "Release-N.N.N" (increment previous N by at least 1)
   2. Base should be from *develop*
2. Update package.json version number
   1. Should match the number in release branch name
3. Compile saD3.js (according to make file advised through main.js in main/dev/src)
   1. Make sure *not* to include test.js from /src
   2. Make sure to include license in compiled file
4. Minify saD3.js to update saD3.min.js
   1. Make sure to include license
5. Update docs
   1. By running make_doc.bat in /docs
6. Git commit changes
   1. Preferably one at a time
7. Finish Release in Git
   1. Rebase *develop* branch from *master* to make sure everything is up to date