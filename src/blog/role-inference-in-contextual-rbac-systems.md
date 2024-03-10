---
title: Role inference in contextual RBAC systems
layout: layouts/article.vto
date: 2020-09-19
type: post
excerpt: Most RBAC implementations use a static user group role mapping to infer roles. However, contextual RBAC systems make it harder to infer roles and I wanted to decode this in my post.
---
Recently, I worked on a contextual [RBAC](https://en.wikipedia.org/wiki/Role-based_access_control) system and I wanted to share some of the high-level learnings I had while working on this.

To start with, simply put RBAC is a computer systems security mechanism where we assign a role to a user based on which the user will then be allowed or disallowed to peform certain actions.

My first introduction to RBAC was when I started working with [WordPress](https://wordpress.org) which is an [extremely popular solution](https://venturebeat.com/media/wordpress-now-powers-30-of-websites/) to build blogs, forums etc. WordPress provided roles like Admin, Moderator and Reader etc. which provides the user with certain privileges depending on the role.

RBAC works similarly in most use cases where a user is mapped to a certain role and there is a very clear many-one mapping, that is, many users are mapped to a certain role.

![A venn diagram of simple RBAC systems with many-one user to role relationships](/img/most-rbac.png "Most RBAC Systems"){class="theme-sensitive-image"}

In these cases, inferring roles becomes very easy, as mathematically speaking, role is a [function](https://en.wikipedia.org/wiki/Function_(mathematics)) of user. In other words, for a given user, there is only one role, so I know which one.

However, contextual RBAC systems bring in an added layer of complexity where a single user maybe mapped to multiple roles and deciding which role depends on both the user and the context.

![A venn diagram of contextual RBAC systems with many-many user to role relationships](/img/contextual-rbac.png "Contextual RBAC Systems"){class="theme-sensitive-image"}

In these cases, role becomes a function of user and context.

What this context may change from one software system to the other.

In some use cases the context may literally be space and/or time.

For example, the user is an administrator while he is at office while he is only a reader at his home if the company's policies need protections related to information confidentiality. Similarly, the user maybe an administrator during office hours and a reader during other hours.

In some other use cases the context is based on which portion of the software system is being accessed.

For example, the total set of available actions (assume read, edit) to perform across pages maybe identitical but some pages maybe user-facing and some only internal documentation. Then depending on the URL being accessed, the user may be an editor on internal documentation pages but only a reader on user-facing pages.

In some other use cases the context may depend on much more complex rules. In those use cases, a rule expression evaluation engine maybe used to evaluate a rule expression which when evaluated to true the user is assigned a certain role and when evaluated to false a different role.

Overall however, the idea remains the same, the role is now a function of user and context and this context is derived based on a set of attributes.

Since role inference is often the first step when loading a screen or page, it is best to keep the context derivation logic as simple as possible to avoid leaving the user hanging at a loading screen.