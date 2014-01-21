Execute any process on your ssh and logout with continue this process. For this action you can use `screen`.
Screen can create multiple windows in a shell, from which you can `detach` and leave them running in the background, even if you log out of your user account.

Create Screen
===
From a terminal, type:

```
$ screen -S [choose-a-window-name]
```

And you will immediately enter the window just created. From this window you can type any command and leave it running in the background.
To detach from the window and go back to the terminal, just press the combination: `ctrl-a d`.
And you will go back to the terminal, where you can start more screens if needed, or even log out without stopping the job.

Access a previously created Screen
===
From a terminal, type:

```
$ screen -r [window-name]
```

to revert a previously created screen. If you do not remember the window name, you can list them through the command:

```
$ screen -ls
```

which gives information about the active screens and their names.

Kill a Screen
===
If your job is finished in one screen and you want to close it, you can go revert it and press: `ctrl-d`
to close it, or you can close it from outside the screen through the command:

```
$ screen -X -S [window-name] kill
```