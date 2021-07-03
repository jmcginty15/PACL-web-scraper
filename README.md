# Pro Am Chess League API/Web Scraper

## Endpoints

### Clubs

#### `GET /clubs/:id`

Find a club by ID.

`{ club: Club }`

404 `{ message: 'Club <id> not found' }` if club does not exist.

###### Club:

| Field | Type | Value |
| --- | --- | --- |
| id | str | Alphanumeric club ID of the form XDDDDDDD where X is a character from A-Z and D are digits from 0-9. `A6053737` |
| name | str | Club name. `PRO AM CHESS LEAGUE` |
| events | arr(Event) | Array of all events in the club's tournament history. |
| members | arr(Member) | Array of all USCF members who have participated in one of the club's events. |

###### Event:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer event ID. `202011283482` |
| name | str | Event name. `PACL 0106 PLEX POD ALL BELTS ALL CLASSES` |
| locationCity | str | Event location city and state. `LENEXA, KS` |
| locationZip | str | Event location zip code. `66215` |
| dates | str | Event dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| chiefTd | int | ID of chief tournament director. `15068332` |
| sections | int | Number of sections. `1` |
| players | int | Number of players. `7` |

###### Member:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer member ID. `30070111` |
| name | str | Member name. `JASON MCGINTY` |
| state | str | Member state. Null if unavailable. `KS` |
| gender | str | Member gender. Null if unavailable. `M` |
| expDate | str | Member's USCF membership expiration date. `2021-11-30` |
| lastChangeDate | str | Date of member's last official USCF rating change. `2021-07-01` |
| FIDEID | int | Integer FIDE ID. Null if not a FIDE member. `2049309` |
| FIDECountry | str | Country of FIDE registration. Null if not a FIDE member. `USA` |
| overallRank | str | Member's overall USCF ranking. Preceded by 'T' if tied with other members at the same ranking. `2972/10221` or `T2972/10221` |
| seniorRank | str | Member's USCF senior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if younger than 65. `65/699` or `T65/699` |
| juniorRank | str | Member's USCF junior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if 21 or older. `2451/5342` or `T2451/5342` |
| femaleRank | str | Member's USCF female ranking. Preceded by 'T' if tied with other members at the same ranking. Null if male. `478/898` or `T478/898` |
| stateRank | str | Member's USCF state ranking. Preceded by 'T' if tied with other members at the same ranking. `28/106` or `T28/106` |
| ratingBlitz | str | Member's USCF Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Blitz games have been played. `1521` or `1521P23` or `Unrated` |
| ratingQuick | str | Member's USCF Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Quick games have been played. `1562` or `1562P20` or `Unrated` |
| ratingRegular | str | Member's USCF Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Regular games have been played. `1656` or `1656P4` or `Unrated` |
| ratingBlitzOnline | str | Member's USCF Online Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Blitz games have been played. `1720` or `1720P13` or `Unrated` |
| ratingQuickOnline | str | Member's USCF Online Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Quick games have been played. `939` or `939P20` or `Unrated` |
| ratingRegularOnline | str | Member's USCF Online Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Regular games have been played. `1044` or `1044P16` or `Unrated` |
| ratingCorrespondence | str | Member's USCF Correspondence rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Correspondence games have been played. `1680` or `1680P14` or `Unrated` |

### Entries

#### `GET /entries/:event/:section/:player`

Find an entry by event ID, section ID, and player ID.

`{ entry: Entry }`

404 `{ message: 'Entry <event>.<section>.<player> not found' }` if entry does not exist.

###### Entry:

| Field | Type | Value |
| --- | --- | --- |
| event | Event | Entry event. |
| section | Section | Entry section. |
| player | Member | Entry player. |
| pairingNum | int | Entry pairing number. `3` |
| score | float | Entry score. `2.5` |
| ratingBefore | str | Member's rating before the event in the same category as the Section. Suffixed by PXX where XX is the number of games played if the rating was provisional. 'Unrated' if no games in the Section's category had been played prior to the event. `1700` or `1700P5` or `Unrated` |
| ratingAfter | str | Member's rating after the event in the same category as the Section. Suffixed by PXX where XX is the number of games played if the rating was provisional. `1581` or `1581P10` |
| ratingDualBefore | str | For dual-rated sections, Member's rating before the event in the Section's secondary rating category. Suffixed by PXX where XX is the number of games played if the rating was provisional. 'Unrated' if no games in the Section's category had been played prior to the event. Null if Section was not dual-rated. `1700` or `1700P5` or `Unrated` |
| ratingDualAfter| str | For dual-rated sections, Member's rating after the event in the Section's secondary rating category. Suffixed by PXX where XX is the number of games played if the rating was provisional. Null if Section was not dual-rated. `1581` or `1581P10` |

###### Event:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer event ID. `202011283482` |
| name | str | Event name. `PACL 0106 PLEX POD ALL BELTS ALL CLASSES` |
| locationCity | str | Event location city and state. `LENEXA, KS` |
| locationZip | str | Event location zip code. `66215` |
| dates | str | Event dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| sponsoringClub | str | Alphanumeric ID for the sponsoring club of the form XDDDDDDD where X is a character from A-Z and D are digits from 0-9. `A6053737` |
| chiefTd | int | ID of chief tournament director. `15068332` |
| sections | int | Number of sections. `1` |
| players | int | Number of players. `7` |

###### Section:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer section ID. `1` |
| name | str | Section name. `UNRATED` |
| dates | str | Section dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| chiefTd | int | ID of chief tournament director. Same as the tournament director of the associated Event if not reported. `15068332` |
| rounds | int | Number of rounds. `5` |
| players | int | Number of players. `7` |
| kFactor | str | K factor identifier. `F` |
| ratingSys | str | Rating category identifier. `D` |
| tournamentType | str | Tournament type identifier. `S` |
| timeControl | str | Time control identifier. `G/35;d0` |

###### Member:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer member ID. `30070111` |
| name | str | Member name. `JASON MCGINTY` |
| state | str | Member state. Null if unavailable. `KS` |
| gender | str | Member gender. Null if unavailable. `M` |
| expDate | str | Member's USCF membership expiration date. `2021-11-30` |
| lastChangeDate | str | Date of member's last official USCF rating change. `2021-07-01` |
| FIDEID | int | Integer FIDE ID. Null if not a FIDE member. `2049309` |
| FIDECountry | str | Country of FIDE registration. Null if not a FIDE member. `USA` |
| overallRank | str | Member's overall USCF ranking. Preceded by 'T' if tied with other members at the same ranking. `2972/10221` or `T2972/10221` |
| seniorRank | str | Member's USCF senior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if younger than 65. `65/699` or `T65/699` |
| juniorRank | str | Member's USCF junior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if 21 or older. `2451/5342` or `T2451/5342` |
| femaleRank | str | Member's USCF female ranking. Preceded by 'T' if tied with other members at the same ranking. Null if male. `478/898` or `T478/898` |
| stateRank | str | Member's USCF state ranking. Preceded by 'T' if tied with other members at the same ranking. `28/106` or `T28/106` |
| ratingBlitz | str | Member's USCF Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Blitz games have been played. `1521` or `1521P23` or `Unrated` |
| ratingQuick | str | Member's USCF Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Quick games have been played. `1562` or `1562P20` or `Unrated` |
| ratingRegular | str | Member's USCF Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Regular games have been played. `1656` or `1656P4` or `Unrated` |
| ratingBlitzOnline | str | Member's USCF Online Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Blitz games have been played. `1720` or `1720P13` or `Unrated` |
| ratingQuickOnline | str | Member's USCF Online Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Quick games have been played. `939` or `939P20` or `Unrated` |
| ratingRegularOnline | str | Member's USCF Online Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Regular games have been played. `1044` or `1044P16` or `Unrated` |
| ratingCorrespondence | str | Member's USCF Correspondence rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Correspondence games have been played. `1680` or `1680P14` or `Unrated` |

### Events

#### `GET /events/:id`

Find an event by ID.

`{ event: Event }`

404 `{ message: 'Event <id> not found' }` if event does not exist.

###### Event:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer event ID. `202011283482` |
| name | str | Event name. `PACL 0106 PLEX POD ALL BELTS ALL CLASSES` |
| locationCity | str | Event location city and state. `LENEXA, KS` |
| locationZip | str | Event location zip code. `66215` |
| dates | str | Event dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| sponsoringClub | Club | Event sponsoring club. |
| chiefTd | Member | Event chief tournament director. |
| sections | arr(Section) | Array of event sections. |
| players | int | Number of players. `7` |
| entries | arr(Entry) | Array of event entries. |

###### Club:

| Field | Type | Value |
| --- | --- | --- |
| id | str | Alphanumeric club ID of the form XDDDDDDD where X is a character from A-Z and D are digits from 0-9. `A6053737` |
| name | str | Club name. `PRO AM CHESS LEAGUE` |

###### Member:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer member ID. `30070111` |
| name | str | Member name. `JASON MCGINTY` |
| state | str | Member state. Null if unavailable. `KS` |
| gender | str | Member gender. Null if unavailable. `M` |
| expDate | str | Member's USCF membership expiration date. `2021-11-30` |
| lastChangeDate | str | Date of member's last official USCF rating change. `2021-07-01` |
| FIDEID | int | Integer FIDE ID. Null if not a FIDE member. `2049309` |
| FIDECountry | str | Country of FIDE registration. Null if not a FIDE member. `USA` |
| overallRank | str | Member's overall USCF ranking. Preceded by 'T' if tied with other members at the same ranking. `2972/10221` or `T2972/10221` |
| seniorRank | str | Member's USCF senior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if younger than 65. `65/699` or `T65/699` |
| juniorRank | str | Member's USCF junior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if 21 or older. `2451/5342` or `T2451/5342` |
| femaleRank | str | Member's USCF female ranking. Preceded by 'T' if tied with other members at the same ranking. Null if male. `478/898` or `T478/898` |
| stateRank | str | Member's USCF state ranking. Preceded by 'T' if tied with other members at the same ranking. `28/106` or `T28/106` |
| ratingBlitz | str | Member's USCF Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Blitz games have been played. `1521` or `1521P23` or `Unrated` |
| ratingQuick | str | Member's USCF Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Quick games have been played. `1562` or `1562P20` or `Unrated` |
| ratingRegular | str | Member's USCF Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Regular games have been played. `1656` or `1656P4` or `Unrated` |
| ratingBlitzOnline | str | Member's USCF Online Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Blitz games have been played. `1720` or `1720P13` or `Unrated` |
| ratingQuickOnline | str | Member's USCF Online Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Quick games have been played. `939` or `939P20` or `Unrated` |
| ratingRegularOnline | str | Member's USCF Online Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Regular games have been played. `1044` or `1044P16` or `Unrated` |
| ratingCorrespondence | str | Member's USCF Correspondence rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Correspondence games have been played. `1680` or `1680P14` or `Unrated` |

###### Section:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer section ID. `1` |
| name | str | Section name. `UNRATED` |
| dates | str | Section dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| chiefTd | int | ID of chief tournament director. Same as the tournament director of the associated Event if not reported. `15068332` |
| rounds | int | Number of rounds. `5` |
| players | int | Number of players. `7` |
| kFactor | str | K factor identifier. `F` |
| ratingSys | str | Rating category identifier. `D` |
| tournamentType | str | Tournament type identifier. `S` |
| timeControl | str | Time control identifier. `G/35;d0` |

###### Entry:

| Field | Type | Value |
| --- | --- | --- |
| section | int | Integer event ID. `202011283482` |
| player | int | Integer player ID. `30070111` |
| pairingNum | int | Entry pairing number. `3` |
| score | float | Entry score. `2.5` |
| ratingBefore | str | Member's rating before the event in the same category as the Section. Suffixed by PXX where XX is the number of games played if the rating was provisional. 'Unrated' if no games in the Section's category had been played prior to the event. `1700` or `1700P5` or `Unrated` |
| ratingAfter | str | Member's rating after the event in the same category as the Section. Suffixed by PXX where XX is the number of games played if the rating was provisional. `1581` or `1581P10` |
| ratingDualBefore | str | For dual-rated sections, Member's rating before the event in the Section's secondary rating category. Suffixed by PXX where XX is the number of games played if the rating was provisional. 'Unrated' if no games in the Section's category had been played prior to the event. Null if Section was not dual-rated. `1700` or `1700P5` or `Unrated` |
| ratingDualAfter| str | For dual-rated sections, Member's rating after the event in the Section's secondary rating category. Suffixed by PXX where XX is the number of games played if the rating was provisional. Null if Section was not dual-rated. `1581` or `1581P10` |

#### `POST /events/:id`

Post a new event by ID. Scrapes the USCF web site for all event data, so only the ID is needed. Returns an identical schema to `GET /events/:id`.

`{ event: Event }`

404 `{ message: 'Event <id> not found' }` if event does not exist in the USCF database.

`{ message: 'Event <id> <event.name> already exists' }` if event already exists in the PACL database.

### Members

#### `GET /members/:id`

Find a member by ID.

`{ member: Member }`

404 `{ message: 'Member <id> not found' }` if member does not exist.

###### Member:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer member ID. `30070111` |
| name | str | Member name. `JASON MCGINTY` |
| state | str | Member state. Null if unavailable. `KS` |
| gender | str | Member gender. Null if unavailable. `M` |
| expDate | str | Member's USCF membership expiration date. `2021-11-30` |
| lastChangeDate | str | Date of member's last official USCF rating change. `2021-07-01` |
| FIDEID | int | Integer FIDE ID. Null if not a FIDE member. `2049309` |
| FIDECountry | str | Country of FIDE registration. Null if not a FIDE member. `USA` |
| overallRank | str | Member's overall USCF ranking. Preceded by 'T' if tied with other members at the same ranking. `2972/10221` or `T2972/10221` |
| seniorRank | str | Member's USCF senior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if younger than 65. `65/699` or `T65/699` |
| juniorRank | str | Member's USCF junior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if 21 or older. `2451/5342` or `T2451/5342` |
| femaleRank | str | Member's USCF female ranking. Preceded by 'T' if tied with other members at the same ranking. Null if male. `478/898` or `T478/898` |
| stateRank | str | Member's USCF state ranking. Preceded by 'T' if tied with other members at the same ranking. `28/106` or `T28/106` |
| ratingBlitz | str | Member's USCF Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Blitz games have been played. `1521` or `1521P23` or `Unrated` |
| ratingQuick | str | Member's USCF Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Quick games have been played. `1562` or `1562P20` or `Unrated` |
| ratingRegular | str | Member's USCF Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Regular games have been played. `1656` or `1656P4` or `Unrated` |
| ratingBlitzOnline | str | Member's USCF Online Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Blitz games have been played. `1720` or `1720P13` or `Unrated` |
| ratingQuickOnline | str | Member's USCF Online Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Quick games have been played. `939` or `939P20` or `Unrated` |
| ratingRegularOnline | str | Member's USCF Online Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Regular games have been played. `1044` or `1044P16` or `Unrated` |
| ratingCorrespondence | str | Member's USCF Correspondence rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Correspondence games have been played. `1680` or `1680P14` or `Unrated` |
| entries | arr(Entry) | Array of member's entries. |
| directedEvents | arr(Event) | Array of events for which the member has been the chief tournament director. |
| directedSections | arr(Section) | Array of sections for which the member has been the chief tournament director. |

###### Entry:

| Field | Type | Value |
| --- | --- | --- |
| event | int | Integer event ID. `202011283482` |
| section | int | Integer section ID. `1` |
| pairingNum | int | Entry pairing number. `3` |
| score | float | Entry score. `2.5` |
| ratingBefore | str | Member's rating before the event in the same category as the Section. Suffixed by PXX where XX is the number of games played if the rating was provisional. 'Unrated' if no games in the Section's category had been played prior to the event. `1700` or `1700P5` or `Unrated` |
| ratingAfter | str | Member's rating after the event in the same category as the Section. Suffixed by PXX where XX is the number of games played if the rating was provisional. `1581` or `1581P10` |
| ratingDualBefore | str | For dual-rated sections, Member's rating before the event in the Section's secondary rating category. Suffixed by PXX where XX is the number of games played if the rating was provisional. 'Unrated' if no games in the Section's category had been played prior to the event. Null if Section was not dual-rated. `1700` or `1700P5` or `Unrated` |
| ratingDualAfter| str | For dual-rated sections, Member's rating after the event in the Section's secondary rating category. Suffixed by PXX where XX is the number of games played if the rating was provisional. Null if Section was not dual-rated. `1581` or `1581P10` |

###### Event:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer event ID. `202011283482` |
| name | str | Event name. `PACL 0106 PLEX POD ALL BELTS ALL CLASSES` |
| locationCity | str | Event location city and state. `LENEXA, KS` |
| locationZip | str | Event location zip code. `66215` |
| dates | str | Event dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| sponsoringClub | str | Alphanumeric ID for the sponsoring club of the form XDDDDDDD where X is a character from A-Z and D are digits from 0-9. `A6053737` |
| sections | int | Number of sections. |
| players | int | Number of players. `7` |

###### Section:

| Field | Type | Value |
| --- | --- | --- |
| event | int | Integer event ID. `202011283482` |
| id | int | Integer section ID. `1` |
| name | str | Section name. `UNRATED` |
| dates | str | Section dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| rounds | int | Number of rounds. `5` |
| players | int | Number of players. `7` |
| kFactor | str | K factor identifier. `F` |
| ratingSys | str | Rating category identifier. `D` |
| tournamentType | str | Tournament type identifier. `S` |
| timeControl | str | Time control identifier. `G/35;d0` |

#### `POST /members/:id`

Post a new member by ID. Scrapes the USCF web site for all member data, so only the ID is needed. Returns an identical schema to `GET /members/:id`.

`{ member: Member }`

404 `{ message: 'Member <id> not found' }` if member does not exist in the USCF database.

`{ message: 'Member <id> <member.name> already exists' }` if member already exists in the PACL database.

#### `PUT /members/:id`

Update a member by ID to the most current USCF data. Scrapes the USCF web site for all member data, so only the ID is needed. Returns an identical schema to `GET /members/:id`.

It is not necessary to call this endpoint when a new event is added, because the `POST /event/:id` endpoint updates all members involved in the posted event.

`{ member: Member }`

404 `{ message: 'Member <id> not found' }` if member does not exist in the PACL database.

### Sections

#### `GET /sections/:event/:id`

Find a section by event ID and section ID.

`{ section: Section }`

404 `{ message: 'Section <event>.<section> not found' }` if section does not exist.

###### Section:

| Field | Type | Value |
| --- | --- | --- |
| event | Event | Section event. |
| id | int | Integer section ID. `1` |
| name | str | Section name. `UNRATED` |
| dates | str | Section dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| chiefTd | Member | Section chief tournament director. |
| rounds | int | Number of rounds. `5` |
| players | int | Number of players. `7` |
| kFactor | str | K factor identifier. `F` |
| ratingSys | str | Rating category identifier. `D` |
| tournamentType | str | Tournament type identifier. `S` |
| timeControl | str | Time control identifier. `G/35;d0` |
| entries | arr(Entry) | Array of section entries. |

###### Event:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer event ID. `202011283482` |
| name | str | Event name. `PACL 0106 PLEX POD ALL BELTS ALL CLASSES` |
| locationCity | str | Event location city and state. `LENEXA, KS` |
| locationZip | str | Event location zip code. `66215` |
| dates | str | Event dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| sponsoringClub | str | Alphanumeric ID for the sponsoring club of the form XDDDDDDD where X is a character from A-Z and D are digits from 0-9. `A6053737` |
| chiefTd | int | ID of chief tournament director. `15068332` |
| sections | int | Number of sections. `1` |
| players | int | Number of players. `7` |

###### Member:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer member ID. `30070111` |
| name | str | Member name. `JASON MCGINTY` |
| state | str | Member state. Null if unavailable. `KS` |
| gender | str | Member gender. Null if unavailable. `M` |
| expDate | str | Member's USCF membership expiration date. `2021-11-30` |
| lastChangeDate | str | Date of member's last official USCF rating change. `2021-07-01` |
| FIDEID | int | Integer FIDE ID. Null if not a FIDE member. `2049309` |
| FIDECountry | str | Country of FIDE registration. Null if not a FIDE member. `USA` |
| overallRank | str | Member's overall USCF ranking. Preceded by 'T' if tied with other members at the same ranking. `2972/10221` or `T2972/10221` |
| seniorRank | str | Member's USCF senior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if younger than 65. `65/699` or `T65/699` |
| juniorRank | str | Member's USCF junior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if 21 or older. `2451/5342` or `T2451/5342` |
| femaleRank | str | Member's USCF female ranking. Preceded by 'T' if tied with other members at the same ranking. Null if male. `478/898` or `T478/898` |
| stateRank | str | Member's USCF state ranking. Preceded by 'T' if tied with other members at the same ranking. `28/106` or `T28/106` |
| ratingBlitz | str | Member's USCF Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Blitz games have been played. `1521` or `1521P23` or `Unrated` |
| ratingQuick | str | Member's USCF Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Quick games have been played. `1562` or `1562P20` or `Unrated` |
| ratingRegular | str | Member's USCF Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Regular games have been played. `1656` or `1656P4` or `Unrated` |
| ratingBlitzOnline | str | Member's USCF Online Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Blitz games have been played. `1720` or `1720P13` or `Unrated` |
| ratingQuickOnline | str | Member's USCF Online Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Quick games have been played. `939` or `939P20` or `Unrated` |
| ratingRegularOnline | str | Member's USCF Online Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Regular games have been played. `1044` or `1044P16` or `Unrated` |
| ratingCorrespondence | str | Member's USCF Correspondence rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Correspondence games have been played. `1680` or `1680P14` or `Unrated` |

###### Entry:

| Field | Type | Value |
| --- | --- | --- |
| player | int | Integer player ID. `30070111` |
| pairingNum | int | Entry pairing number. `3` |
| score | float | Entry score. `2.5` |
| ratingBefore | str | Member's rating before the event in the same category as the Section. Suffixed by PXX where XX is the number of games played if the rating was provisional. 'Unrated' if no games in the Section's category had been played prior to the event. `1700` or `1700P5` or `Unrated` |
| ratingAfter | str | Member's rating after the event in the same category as the Section. Suffixed by PXX where XX is the number of games played if the rating was provisional. `1581` or `1581P10` |
| ratingDualBefore | str | For dual-rated sections, Member's rating before the event in the Section's secondary rating category. Suffixed by PXX where XX is the number of games played if the rating was provisional. 'Unrated' if no games in the Section's category had been played prior to the event. Null if Section was not dual-rated. `1700` or `1700P5` or `Unrated` |
| ratingDualAfter| str | For dual-rated sections, Member's rating after the event in the Section's secondary rating category. Suffixed by PXX where XX is the number of games played if the rating was provisional. Null if Section was not dual-rated. `1581` or `1581P10` |

### Games

#### `GET /games/:event/:section/:round/:white/:black`

Find a game by event ID, section ID, round number, and participants. Will return a game with unreported colors regardless of the order of white and black parameters. For example, `GET /games/:event/:section/:round/30070111/16729774` and `GET /games/:event/:section/:round/16729774/30070111` would return the same game for the same event, section, and round parameters if the game's color assignments were not reported. If the color assignments were reported, only the correct order of player IDs would return the game and the other would return the below 404 response.

`{ game: Game }`

404 `{ message: 'Game <id>.<section>.<round> <white>-<black> not found' }` if game does not exist.

###### Game:

| Field | Type | Value |
| --- | --- | --- |
| event | Event | Game event. |
| section | Section | Game section. |
| round | int | Round number. |
| white | Member | White player, or `player1` for games with unreported color assignments. |
| black | Member | Black player, or `player2` for games with unreported color assignments. |
| colorsReported | boolean | Indicates whether or not the color assignments were reported to the USCF. If `false`, the `white` and `black` fields are meaningless and can be interpreted simply as `player1` and `player2`. |
| result | str | `1-0` for a win by the white player (or `player1`), `0-1` for a win by the black player (or `player2`), or `1/2-1/2` for a draw. |

###### Event:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer event ID. `202011283482` |
| name | str | Event name. `PACL 0106 PLEX POD ALL BELTS ALL CLASSES` |
| locationCity | str | Event location city and state. `LENEXA, KS` |
| locationZip | str | Event location zip code. `66215` |
| dates | str | Event dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| sponsoringClub | str | Alphanumeric ID for the sponsoring club of the form XDDDDDDD where X is a character from A-Z and D are digits from 0-9. `A6053737` |
| chiefTd | int | ID of chief tournament director. `15068332` |
| sections | int | Number of sections. `1` |
| players | int | Number of players. `7` |

###### Section:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer section ID. `1` |
| name | str | Section name. `UNRATED` |
| dates | str | Section dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| chiefTd | int | ID of chief tournament director. `15068332` |
| rounds | int | Number of rounds. `5` |
| players | int | Number of players. `7` |
| kFactor | str | K factor identifier. `F` |
| ratingSys | str | Rating category identifier. `D` |
| tournamentType | str | Tournament type identifier. `S` |
| timeControl | str | Time control identifier. `G/35;d0` |

###### Member:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer member ID. `30070111` |
| name | str | Member name. `JASON MCGINTY` |
| state | str | Member state. Null if unavailable. `KS` |
| gender | str | Member gender. Null if unavailable. `M` |
| expDate | str | Member's USCF membership expiration date. `2021-11-30` |
| lastChangeDate | str | Date of member's last official USCF rating change. `2021-07-01` |
| FIDEID | int | Integer FIDE ID. Null if not a FIDE member. `2049309` |
| FIDECountry | str | Country of FIDE registration. Null if not a FIDE member. `USA` |
| overallRank | str | Member's overall USCF ranking. Preceded by 'T' if tied with other members at the same ranking. `2972/10221` or `T2972/10221` |
| seniorRank | str | Member's USCF senior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if younger than 65. `65/699` or `T65/699` |
| juniorRank | str | Member's USCF junior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if 21 or older. `2451/5342` or `T2451/5342` |
| femaleRank | str | Member's USCF female ranking. Preceded by 'T' if tied with other members at the same ranking. Null if male. `478/898` or `T478/898` |
| stateRank | str | Member's USCF state ranking. Preceded by 'T' if tied with other members at the same ranking. `28/106` or `T28/106` |
| ratingBlitz | str | Member's USCF Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Blitz games have been played. `1521` or `1521P23` or `Unrated` |
| ratingQuick | str | Member's USCF Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Quick games have been played. `1562` or `1562P20` or `Unrated` |
| ratingRegular | str | Member's USCF Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Regular games have been played. `1656` or `1656P4` or `Unrated` |
| ratingBlitzOnline | str | Member's USCF Online Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Blitz games have been played. `1720` or `1720P13` or `Unrated` |
| ratingQuickOnline | str | Member's USCF Online Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Quick games have been played. `939` or `939P20` or `Unrated` |
| ratingRegularOnline | str | Member's USCF Online Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Regular games have been played. `1044` or `1044P16` or `Unrated` |
| ratingCorrespondence | str | Member's USCF Correspondence rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Correspondence games have been played. `1680` or `1680P14` or `Unrated` |

#### `GET games/:player/all`

Find all games of a given player by ID. Returns an identical schema to `GET /games/:event/:section/:round/:white/:black`.

`{ games: arr(Game) }`

#### `GET /games/:player/white`

Find all games played with the white pieces by a given player by ID. Only returns games with reported color assignments. Returns an identical schema to `GET /games/:event/:section/:round/:white/:black`.

`{ games: arr(Game) }`

#### `GET /games/:player/black`

Find all games played with the black pieces by a given player by ID. Only returns games with reported color assignments. Returns an identical schema to `GET /games/:event/:section/:round/:white/:black`.

`{ games: arr(Game) }`

#### `GET /games/:player/unreported`

Find all games of a given player by ID with unreported color assignments. Returns an identical schema to `GET /games/:event/:section/:round/:white/:black`.

`{ games: arr(Game) }`

#### `GET /games/:player/:event/all`

Find all games of a given player at a given event by player ID and event ID. 

`{ event: Event, games: arr(Game) }`

###### Event:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer event ID. `202011283482` |
| name | str | Event name. `PACL 0106 PLEX POD ALL BELTS ALL CLASSES` |
| locationCity | str | Event location city and state. `LENEXA, KS` |
| locationZip | str | Event location zip code. `66215` |
| dates | str | Event dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| sponsoringClub | str | Alphanumeric ID for the sponsoring club of the form XDDDDDDD where X is a character from A-Z and D are digits from 0-9. `A6053737` |
| chiefTd | int | ID of chief tournament director. `15068332` |
| sections | int | Number of sections. `1` |
| players | int | Number of players. `7` |

###### Game:

| Field | Type | Value |
| --- | --- | --- |
| section | Section | Game section. |
| round | int | Round number. |
| white | Member | White player, or `player1` for games with unreported color assignments. |
| black | Member | Black player, or `player2` for games with unreported color assignments. |
| colorsReported | boolean | Indicates whether or not the color assignments were reported to the USCF. If `false`, the `white` and `black` fields are meaningless and can be interpreted simply as `player1` and `player2`. |
| result | str | `1-0` for a win by the white player (or `player1`), `0-1` for a win by the black player (or `player2`), or `1/2-1/2` for a draw. |

###### Section:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer section ID. `1` |
| name | str | Section name. `UNRATED` |
| dates | str | Section dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| chiefTd | int | ID of chief tournament director. `15068332` |
| rounds | int | Number of rounds. `5` |
| players | int | Number of players. `7` |
| kFactor | str | K factor identifier. `F` |
| ratingSys | str | Rating category identifier. `D` |
| tournamentType | str | Tournament type identifier. `S` |
| timeControl | str | Time control identifier. `G/35;d0` |

###### Member:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer member ID. `30070111` |
| name | str | Member name. `JASON MCGINTY` |
| state | str | Member state. Null if unavailable. `KS` |
| gender | str | Member gender. Null if unavailable. `M` |
| expDate | str | Member's USCF membership expiration date. `2021-11-30` |
| lastChangeDate | str | Date of member's last official USCF rating change. `2021-07-01` |
| FIDEID | int | Integer FIDE ID. Null if not a FIDE member. `2049309` |
| FIDECountry | str | Country of FIDE registration. Null if not a FIDE member. `USA` |
| overallRank | str | Member's overall USCF ranking. Preceded by 'T' if tied with other members at the same ranking. `2972/10221` or `T2972/10221` |
| seniorRank | str | Member's USCF senior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if younger than 65. `65/699` or `T65/699` |
| juniorRank | str | Member's USCF junior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if 21 or older. `2451/5342` or `T2451/5342` |
| femaleRank | str | Member's USCF female ranking. Preceded by 'T' if tied with other members at the same ranking. Null if male. `478/898` or `T478/898` |
| stateRank | str | Member's USCF state ranking. Preceded by 'T' if tied with other members at the same ranking. `28/106` or `T28/106` |
| ratingBlitz | str | Member's USCF Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Blitz games have been played. `1521` or `1521P23` or `Unrated` |
| ratingQuick | str | Member's USCF Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Quick games have been played. `1562` or `1562P20` or `Unrated` |
| ratingRegular | str | Member's USCF Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Regular games have been played. `1656` or `1656P4` or `Unrated` |
| ratingBlitzOnline | str | Member's USCF Online Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Blitz games have been played. `1720` or `1720P13` or `Unrated` |
| ratingQuickOnline | str | Member's USCF Online Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Quick games have been played. `939` or `939P20` or `Unrated` |
| ratingRegularOnline | str | Member's USCF Online Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Regular games have been played. `1044` or `1044P16` or `Unrated` |
| ratingCorrespondence | str | Member's USCF Correspondence rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Correspondence games have been played. `1680` or `1680P14` or `Unrated` |

#### `GET /games/:player/:event/white`

Find all games played with the white pieces by a given player at a given event by player ID and event ID. Only returns games with reported color assignments. Returns an identical schema to `GET /games/:player/:event/all`.

`{ event: Event, games: arr(Game) }`

#### `GET /games/:player/:event/black`

Find all games played with the black pieces by a given player at a given event by player ID and event ID. Only returns games with reported color assignments. Returns an identical schema to `GET /games/:player/:event/all`.

`{ event: Event, games: arr(Game) }`

#### `GET /games/:player/unreported`

Find all games of a given player at a given event by player ID and event ID with unreported color assignments. Returns an identical schema to `/GET /games/:player/:event/all`.

`{ event: Event, games: arr(Game) }`

#### `GET /games/:player/:event/:section/all`

Find all games of a given player at a given event and section by player ID, event ID, and section ID. 

`{ event: Event, section: Section, games: arr(Game) }`

###### Event:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer event ID. `202011283482` |
| name | str | Event name. `PACL 0106 PLEX POD ALL BELTS ALL CLASSES` |
| locationCity | str | Event location city and state. `LENEXA, KS` |
| locationZip | str | Event location zip code. `66215` |
| dates | str | Event dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| sponsoringClub | str | Alphanumeric ID for the sponsoring club of the form XDDDDDDD where X is a character from A-Z and D are digits from 0-9. `A6053737` |
| chiefTd | int | ID of chief tournament director. `15068332` |
| sections | int | Number of sections. `1` |
| players | int | Number of players. `7` |

###### Section:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer section ID. `1` |
| name | str | Section name. `UNRATED` |
| dates | str | Section dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| chiefTd | int | ID of chief tournament director. `15068332` |
| rounds | int | Number of rounds. `5` |
| players | int | Number of players. `7` |
| kFactor | str | K factor identifier. `F` |
| ratingSys | str | Rating category identifier. `D` |
| tournamentType | str | Tournament type identifier. `S` |
| timeControl | str | Time control identifier. `G/35;d0` |

###### Game:

| Field | Type | Value |
| --- | --- | --- |
| round | int | Round number. |
| white | Member | White player, or `player1` for games with unreported color assignments. |
| black | Member | Black player, or `player2` for games with unreported color assignments. |
| colorsReported | boolean | Indicates whether or not the color assignments were reported to the USCF. If `false`, the `white` and `black` fields are meaningless and can be interpreted simply as `player1` and `player2`. |
| result | str | `1-0` for a win by the white player (or `player1`), `0-1` for a win by the black player (or `player2`), or `1/2-1/2` for a draw. |

###### Member:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer member ID. `30070111` |
| name | str | Member name. `JASON MCGINTY` |
| state | str | Member state. Null if unavailable. `KS` |
| gender | str | Member gender. Null if unavailable. `M` |
| expDate | str | Member's USCF membership expiration date. `2021-11-30` |
| lastChangeDate | str | Date of member's last official USCF rating change. `2021-07-01` |
| FIDEID | int | Integer FIDE ID. Null if not a FIDE member. `2049309` |
| FIDECountry | str | Country of FIDE registration. Null if not a FIDE member. `USA` |
| overallRank | str | Member's overall USCF ranking. Preceded by 'T' if tied with other members at the same ranking. `2972/10221` or `T2972/10221` |
| seniorRank | str | Member's USCF senior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if younger than 65. `65/699` or `T65/699` |
| juniorRank | str | Member's USCF junior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if 21 or older. `2451/5342` or `T2451/5342` |
| femaleRank | str | Member's USCF female ranking. Preceded by 'T' if tied with other members at the same ranking. Null if male. `478/898` or `T478/898` |
| stateRank | str | Member's USCF state ranking. Preceded by 'T' if tied with other members at the same ranking. `28/106` or `T28/106` |
| ratingBlitz | str | Member's USCF Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Blitz games have been played. `1521` or `1521P23` or `Unrated` |
| ratingQuick | str | Member's USCF Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Quick games have been played. `1562` or `1562P20` or `Unrated` |
| ratingRegular | str | Member's USCF Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Regular games have been played. `1656` or `1656P4` or `Unrated` |
| ratingBlitzOnline | str | Member's USCF Online Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Blitz games have been played. `1720` or `1720P13` or `Unrated` |
| ratingQuickOnline | str | Member's USCF Online Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Quick games have been played. `939` or `939P20` or `Unrated` |
| ratingRegularOnline | str | Member's USCF Online Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Regular games have been played. `1044` or `1044P16` or `Unrated` |
| ratingCorrespondence | str | Member's USCF Correspondence rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Correspondence games have been played. `1680` or `1680P14` or `Unrated` |

#### `GET /games/:player/:event/:section/white`

Find all games played with the white pieces by a given player at a given event and section by player ID, event ID, and section ID. Only returns games with reported color assignments. Returns an identical schema to `GET /games/:player/:event/:section/all`.

`{ event: Event, section: Section, games: arr(Game) }`

#### `GET /games/:player/:event/:section/black`

Find all games played with the black pieces by a given player at a given event and section by player ID, event ID, and section ID. Only returns games with reported color assignments. Returns an identical schema to `GET /games/:player/:event/:section/all`.

`{ event: Event, section: Section, games: arr(Game) }`

#### `GET /games/:player/unreported`

Find all games of a given player at a given event and section by player ID, event ID, and section ID with unreported color assignments. Returns an identical schema to `/GET /games/:player/:section/:event/all`.

`{ event: Event, section: Section, games: arr(Game) }`

#### `GET /games/:player1/:player2`

Find all games played between two players. Returns an identical schema to `GET /games/:player/all`.

`{ games: games }`