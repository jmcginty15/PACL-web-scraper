# Pro Am Chess League API/Web Scraper

## Endpoints

### Clubs

`GET /clubs/:id`

Find a club by ID.

`{ club: Club }`

###### Club:

| Field | Value |
| --- | --- |
| id | str |
| name | str |
| events | arr(Event) |
| members | arr(Member) |

###### Event:

| Field | Value |
| --- | --- |
| id | int |
| name | str |
| locationCity | str |
| locationZip | str |
| dates | str |
| chiefTd | int |
| sections | int |
| players | int |

###### Member:

| Field | Value |
| --- | --- |
| id | int |
| name | str |
| state | str |
| gender | str |
| expDate | str |
| lastChangeDate | str |
| FIDEID | int |
| FIDECountry | str |
| overallRank | str |
| seniorRank | str |
| juniorRank | str |
| femaleRank | str |
| stateRank | str |
| ratingBlitz | str |
| ratingQuick | str |
| ratingRegular | str |
| ratingBlitzOnline | str |
| ratingQuickOnline | str |
| ratingRegularOnline | str |
| ratingCorrespondence | str |