# Italia Facile

Act as a senior SaaS product team composed of:

- Product Manager

- UX Designer

- Software Architect

- Frontend Engineer

Design and generate a modern web application (mobile-first and responsive) that can later also become a mobile app.

IMPORTANT:

Generate the technical structure in English.

All UI text must be in Italian.

UX writing must be simple and clear for non-technical users.

PRODUCT IDEA:

The application is a relocation assistant that helps Bulgarian people move to Italy by guiding them step-by-step through documents, bureaucracy and life setup.

The product should feel like a trusted guide, not a social network.

MAIN PRODUCT GOAL:

Help users understand:

What to do

When to do it

How to do it

What documents they need

TARGET USERS:

Bulgarian people relocating to Italy for:

Work

Study

Family

UX PRINCIPLES:

Simple

Human centered

Calm and reassuring

Clear next action always visible

Low cognitive load

Mobile first

Accessible

The app must always show the next step the user should take.

APP STRUCTURE:

Main navigation (bottom navigation pattern):

Home

Journey

Guide

Community

Profile

FEATURES:

1 ONBOARDING

Ask simple questions:

Name

Nationality

Destination country

Destination city

Reason for moving

Already in Italy (yes/no)

Tax code (yes/no)

Job status

Italian language level

After onboarding generate a personalized relocation journey.

2 RELOCATION JOURNEY (CORE FEATURE)

This is the main product feature.

Create a structured relocation roadmap.

Example steps:

Get tax code

Register residence

Healthcare registration

Open bank account

Find long term housing

Each step must include:

Title

Simple explanation

Why it matters

Required documents

Where to go

Estimated time

Cost

Checklist

Completion button

STEP STATES:

Completed

Current

Locked

Include relocation progress bar.

3 HOME DASHBOARD

Show:

Greeting with user name

Relocation progress card:

Progress %

Next step

Continue button

Quick actions:

Guide documenti

Guida affitti

Fai una domanda

Recent guides section.

4 GUIDES SECTION

Knowledge hub.

Categories:

Documenti

Casa

Lavoro

Sanità

Vita in Italia

Guide structure:

Title

Reading time

Sections

Simple language

Bullet points

Add search.

5 COMMUNITY Q&A

Simple structured Q&A.

Users can:

Ask question

Answer

Upvote answers

No chat.

No messaging.

No complex reputation.

Simple feed.

6 PROFILE

User info:

Name

City

Status

Journey statistics:

Completed steps

Remaining steps

DESIGN STYLE:

Modern SaaS style similar to:

Airbnb

Notion

Duolingo

Revolut

Stripe

VISUAL STYLE:

Clean interface

Soft shadows

Rounded cards

Large spacing

Friendly UI

Warm but professional

COLOR SYSTEM:

Primary:

#2E8B57 (Italian green)

Secondary:

#2F6BFF (Mediterranean blue)

Background:

#FCFAF7

Cards:

White

Text:

#1F2937

Success:

#22C55E

Warning:

#F59E0B

Borders:

#E5E7EB

TYPOGRAPHY:

Use Inter font.

Design hierarchy:

Large headings

Readable body text

Clear spacing

COMPONENT DESIGN:

Buttons:

Primary:

Green background

White text

48px height

12px radius

Secondary:

White

Border

Dark text

Cards:

White background

Soft shadow

16–24px padding

Rounded corners

Progress bar:

Modern rounded style.

Icons:

Simple outline icons.

LAYOUT:

Mobile first responsive design.

Desktop max width container.

TECH STRUCTURE:

Structure like a scalable SaaS product.

Frontend:

React / Next.js preferred.

Backend:

API separated from UI.

Database:

Structured for scalability.

Authentication:

Modern auth structure.

ARCHITECTURE PRINCIPLES:

Clean architecture.

API first.

Environment configs.

Avoid vendor lock-in.

MULTI TENANT READINESS:

Even if MVP is single tenant structure data model for future SaaS.

Example entities:

Tenant

User

JourneyTemplate

JourneyInstance

StepTemplate

StepInstance

Guide

Question

Answer

Tenant could later represent nationality groups.

Future expansion must allow:

Other nationalities

Other countries

Multi language

Multiple relocation programs

Do NOT hardcode Bulgaria or Italy into the core logic.

Make country configurable.

AWS FUTURE PORTABILITY:

Design structure so it could later migrate to AWS:

Potential future:

AWS Cognito

AWS RDS

AWS S3

AWS Lambda

CloudFront

Do not implement now.

Just keep architecture compatible.

MOBILE APP READINESS:

Structure UI so it can easily become:

React Native app

or PWA

COMPONENTS TO GENERATE:

Navigation bar

Progress card

Journey timeline

Step detail layout

Guide cards

Question cards

Input fields

Buttons

Search bar

UX DETAILS:

Always show next action.

Avoid empty states.

Create helpful empty states.

Create loading states.

Create basic error states.

Example empty state:

"Nessuna domanda ancora. Fai la prima domanda."

COPY STYLE:

Simple Italian.

No legal language.

No bureaucracy tone.

IMPORTANT:

DO NOT BUILD:

Marketplace

Chat system

Job board

AI chatbot

Complex notification systems

Document upload system

Keep MVP clean.

OUTPUT REQUIRED:

Generate:

App structure

Page structure

Component structure

Basic design system

Data model suggestion

API structure suggestion

UX flow suggestion

Scalable architecture suggestion

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1c26c319-f6a7-4c18-808f-9e616da6ae13).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
