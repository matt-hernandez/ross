Thanks for contributing!

## Dependencies

* node `^8.9.2`
* npm `^5.8.0`

## Installing

```
npm install
```

## Running the chart preview

Before you can start the chart preview, there are two things. Navigate to `/src/app` in the project.
There are two files:

* app.component.copy.html
* app.component.copy.ts

**Copy** both of these files and remove the `copy` portion of their names. So now you should have two
new files.

* app.component.html
* app.component.ts

These are the files you will be working out of when you want to play around with any new functionality
you create. The preview app will not boot up if these files are not present. They are also ignored
by Git, so have fun doing whatever you want with them. Their changes won't be tracked.

Then run:

```
npm start
```

Then go to http://localhost:4200/ once the preview compiles successfully.

All of the files related to the actual chart library are under `/projects/ross/src`. This
is where you'll be doing most of your work. Any changes you make to code under this directory will
cause the app to auto-refresh, so you can see your changes live in the preview.

## Testing

```
npm run test
```

## Linting

```
npm run lint
```

## Building

Running the below command will make a folder in `./dist` called `ross`. This folder can
be published to the npm registry, if that's in our future.

```
npm run build
```

## Making a PR

Head on over to our list of issues to see which issues are labeled with `02 - Dev ready`. This means
that the issue is ready for its own PR. On Gitlab, you'll see a button called "Create Merge Request."
Click on this button if a PR for this issue does not exist. After this button is clicked, a MR and branch
will be auto-created with a name that matches the issue.

Checkout the branch that was created and work out of that for the issue. As you work, make frequent
commits and try to make them small and cohesive. Anytime you accomplish something in code, and I do mean
ANYTHING, it's probably a good time to commit.

Once you feel that things are in a good place for your branch, push them to the repo. We have a CI
process in place that will run as soon as new commits are added to your branch. It currently only
contains two steps, one to install dependencies and another to lint your code.

If your branch passes the CI process, and you think you are ready to merge, go over to the merge request
page for your page. Click on the button called "Resolve WIP Status". This will mark your branch as
ready for review.

Last step, assign the MR to @matt.hernandez or another code admin for final checks. We will merge the
branch if we don't see any issues.

## Making new components, services, and directives

Our project has a custom generator script for creating new features in the library. It follows this format:

```
node generate <feature-type> <name> [component-mixin-args]
```

There are three `feature-type`s:

* component
* directive
* service

`name` is the dash separated name of the new feature. For example `pie-chart`, or `text-group`. DO NOT, include
the word `component`, `service`, or `directive` in the `name` argument.

```
node generate component pie-chart
node generate directive formatter
node generate service child-component-detector
```

Depending on `feature-type`, a new folder will be created inside of either `components`, `directives`, or `services`
inside `/ross/projects/ross/src/lib`. The name of the new folder will be the same as `name`.

Inside the new folder, there are corresponding files for the new feature you created. If you explore around inside
the files, you'll also see that the dash separated name has been converted to Pascal case for naming `class` declarations.

Finally, the final argument is reserved for mixin arguments that are only valid if `feature-type` is `component`.
You can pass in a space separated set of mixins in the format of `--<mixin-name>`.

For example:

```
node generate component pie-chart --stylable --data-visualizable
node generate component text-group --positionable
```

When the new component is generated, it will have the boilerplate code necessary to extend the component class,
with the call to `applyMixins()` with the correct arguments, and the new class will also implement the correct
mixin interfaces with the right props.

The one weak portion of the script when generating components with mixins is that property types will not be
auto-resolved inside the new class. You'll have to do that manually. But this isn't hard to do if you're using
an IDE with IntelliSense. We recommend Visual Studio Code for working on Angular projects.

## Learning more about the codebase

Head on over to our [Wiki](https://idean-open-source.gitbook.io/ross/) and read the pages under "Contributing" to learn more about the code base
and best practices for contributing to this library.
