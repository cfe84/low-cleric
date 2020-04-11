This is made for people who are getting tired to get asked "when is X going to be ready". It takes a semi-structure, semi-ordered pipeline and some form of a velocity, and yields lead-times for each bits of the pipeline.

In other words, you give it a pipeline with ordered and estimated things (epics, tasks, features, stories - whatever you call these) and a "velocity", and this spits you lead-time and expected date for each of the things in your backlog.

# Concepts

This tool work on two main assumptions:

1. Considering that your backlog is acting like a serialized queue, which means that the items sitting in the queue are ordered in the way you want them to be processed
2. That the software team is operating like a blackbox production unit, which means that on average it will process the items in a roughly indistinct manner, a unit of work will be a unit of work.

Overall, this tool is using how much time is required _on average_ by a software team to output a unit of work. Say that you are outputting 10 stories per week on average, and these stories each weigh 10 units of work, then the team is outputting 100 units of work per 5 days, i.e. a unit of work is worth 5 days / 100 = .05 days. This means that, if 100 units of work are sitting in front of a task, it should on average wait 5 days before it gets started. If the task itself is worth 100 units of work, it should on average take 5 days to be processed. Thusly, you can roughly expect the task to take 10 days.

This is a very rough estimate, but it roots itself into the [law of large numbers](https://en.wikipedia.org/wiki/Law_of_large_numbers).

## Unit of work

A unit of work is something that represents the amount of work required by the software team to build the task. It should be proportional to the time it takes for a single processor (a.k.a. developer, a.k.a. human) to realize it. It can be whatever you want: t-shirt sizes, Fibonacci tables, ideal-days, whatever works for you. As long as a task worth 10 units takes on average twice as long as a task that takes 5, this will work for you.


## Batch

A batch is a group of tasks / features / stories / epics / whatever you call it, which gets released together, whether on purpose or not. This is where the "semi-ordered" in the introduction is coming from: we consider the backlog to be serialized, not by tasks, but by batches. The reality of things is that it's very hard and rarely productive for more than one person to work on one thing. If your team is composed of more than one person, then it is likely the team will do more than one thing at a time. You will then start multiple tasks, and complete them in parallel. A batch is grouping multiple tasks that are going to be executed simultaneously. They might be several tasks related to the same feature, or several features altogether.

The concept of batch size represents the size of a group of tasks, and it depends on how many tasks, and how big those tasks are. The average batch size should be kept just large enough (i.e. small!) so that the team members have stuff to do, but not too much.

Low-cleric groups tasks into batches based on order (a.k.a rank). If two tasks are ordered "10", then it assumes they're part of the same batch. If both are worth 5 units of work, then the batch is worth 10 units of work, and will take 10UOW/DAYS/UOW to complete. Once again, this is naive, but on average gives a sufficiently good forecast.


## Consolidating into batches

A batch is a group of tasks, tasks are often grouped into hierarchies and other constructs such as features, stories, epics, sagas, tasks, spikes, etc. These clash a little because you might be working on a small random feature at the same time as a long-living epic, and you are not really working on these sequentially but in parallel. Coupling the lead-time calculation of the small feature with the entirety of the batch isn't useful. As we've determined earlier, the task for the small feature should therefore be part of the same batch as _some_ of the tasks of the epic. The keyword is _some_. Large features (epics, sagas) are often (they should be) decomposed into smaller sets of features. These should be ordered accordingly. In this case, the "order" of the epic is irrelevant, what matters is the order of all the subfeatures. A decomposition into features that are in the same order of magnitude of effort is essential to give significant estimates. If an epic is _weeks_, its features are _days_, then these can be ordered and intermingled with other unrelated features. Lead-time can then be calculated at the feature level, and consolidated at an epic level. 

For example, we might have

| Epic 1             | Epic 2             | Rando-feature 1      |
| ------------------ | ------------------ | -------------------- |
| Task a - order: 10 | Task a - order: 10 | Feature 1 - order 15 |
| Task b - order: 10 | Task b - order: 15 |                      |
| Task c - order: 15 | Task c - order: 15 |                      |
| Task d - order: 15 | Task d - order: 20 |                      |

This will give three batches:
- 10: Epic1.taskA, Epic1.taskB, Epic2.taskA
- 15: Epic1.taskC, Epic1.taskD, Epic2.taskB, Epic2.taskC, Rando feature
- 20: Epic2.taskD

Which means the lead time for Epic 1 and Rando-feature 1 will be the same.

This allows to keep granularity for what needs it, to calculate complex dates with intermingled features and releases conflicting for resources, give final delivery forecast for the epic, and provide forecasts for intermediary milestones (not that reporting on the latter should be of any significance, but life is such that sometimes some managers will ask you this, might as well be able to provide an answer and get back to work).

What is the lead time for an epic? The largest lead-time for its components.

## Refining estimates

Backlogs are hard and costly to manage. More often than not, the complexity is not worth it. Any preliminary decomposition is bound to be inaccurate, and create product management debt. How many times have you been confronted to a backlog riddled with abandoned stories and tasks that everyone knows _we'll never do_?

A solution to that is to decompose _just in time_. This means that a feature's decomposition into stories and implementation tasks can wait until someone actually thinks on how they'll do it, using the most relevant information because _they'll do it next week_. Such a strategy helps reducing backlog management overhead by also reducing the likelihood that a task added to the backlog won't ever be done, since wind changes direction but less often from one week to the next.

But nice as it be, people will still come and ask "when will _X_ be ready?" and you still want to be able to provide an answer.

The solution therefore is to have high-level estimates: the larger tasks (epics, sagas, feature-sets, ...) will bear the rough-order-of-magnitude until someone spends time decomposing it into something more precise.

The recommended approach for that is to use the same scale as for the smaller features, one order of magnitude higher. If the size of what you are implementing is worth 1-2-3-5-8-13, then your epics can be 21-34-55-89-144. Identify what brings complexity, the number of estimated sub-features, and estimate accordingly.

Low-cleric takes the finest level of estimate available and estimates accordingly, using levels of confidence as a side indicator that rough-order-of-magnitude is a long term forecast that one should trust too much

## Uncertainty index

The uncertainty index of a task estimate tells how much padding you might want to communicate, based on how close the estimate on a given task is close to your average. It is used for estimates that are especially uncertain in your given context. This is a simple concept but its application is hairy.

If most of your work is deterministic, e.g. you tell "it will take me an hour" and it _does_ take an hour, then anything where "it will take one to two hours" is a 1.5h estimate with a 33% confidence index. This means that it might take 33% less, or 33% more. The estimate is in the middle.

If you work is non-deterministic, e.g. most of the work is over/underestimated by, say, 20%, then the uncertainty index for a task where you _think_ it will take 10 days but it might 12 or it might take 8 is 0, because your current velocity is already accounting for the base uncertainty.

There are other ways of calculating uncertainty, PERT is one. This is the one we've picked because it's relatively simple.

What these two examples outline is that uncertainty is a certain fact of estimation in software. The default uncertainty when observing metrics and using your usual estimation tactics should be 0, and the factor should be used for these cases:

1. Estimates are particularly uncertain, like when estimating a ROoM for an epic, in which case the estimate will probably be off by a respectable amount. 
2. Variability of estimates is particularly volatile, some of them are very precise, some are very uncertain. This can happen when some of your work is on a large platform with lots on unpredictable dependencies, while some is on a small one with deterministic complexity. Then, changes to the large platform should be slapped with corresponding unknowns.
3. Dependencies on other teams are not accounted for in the tool, and so you might want to account for slippage due to late dependency arrival by increasing the uncertainty index.

Uncertainty gets reported in two ways: 
- a combined index which relates uncertainty based on composition (uncertainty of tasks within a batch) and on sequencing (uncertainty of preceding batches)
- a calculated potential drift which combines the best case scenario, and the worst case scenario. In practice those are hard to communicate because the dates they yield give the impression that they are imprecise, which they are for a good reason, and the reality of software is that uncertainty is a certainty, and having to admit the truth of variability is harder than ignoring it and pretending we know what we're doing.

# In practice

Low-cleric provides 3 main interfaces:

- Batch assembly,
- Lead time calculation,
- Schedule calculation,

The batch assembly assembles ordered batches based on tasks.

The lead time calculator calculates lead time based on ordered batches.

The schedule calculator calculates dates based on lead times.

## How to use

To use it you will need to write an adapter to eat whatever garbagey task management solution your company is using (none is good apparently).

This thing is built in typescript so you can use it as such. 

### in node



### in the browser

You need to install [node](https://www.nodejs.org) before anything else. If you want to use it in the front end, build the distrib by running `npm install && npm run webpack`, then pick the `law-cleric.js` file and have fun.
