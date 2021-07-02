# Pro Am Chess League API/Web Scraper

## Endpoints

### Clubs

`GET /clubs/:id`

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

`GET /entries/:event/:section/:player`

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

`GET /events/:id`

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

###### Member

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
| section | Section | Entry section. |
| player | Member | Entry player. |
| pairingNum | int | Entry pairing number. `3` |
| ratingBefore | str | Member's rating before the event in the same category as the Section. Suffixed by PXX where XX is the number of games played if the rating was provisional. 'Unrated' if no games in the Section's category had been played prior to the event. `1700` or `1700P5` or `Unrated` |
| ratingAfter | str | Member's rating after the event in the same category as the Section. Suffixed by PXX where XX is the number of games played if the rating was provisional. `1581` or `1581P10` |
| ratingDualBefore | str | For dual-rated sections, Member's rating before the event in the Section's secondary rating category. Suffixed by PXX where XX is the number of games played if the rating was provisional. 'Unrated' if no games in the Section's category had been played prior to the event. Null if Section was not dual-rated. `1700` or `1700P5` or `Unrated` |
| ratingDualAfter| str | For dual-rated sections, Member's rating after the event in the Section's secondary rating category. Suffixed by PXX where XX is the number of games played if the rating was provisional. Null if Section was not dual-rated. `1581` or `1581P10` |

`POST /events/:id`

Post a new event by ID. Backend scrapes the USCF web site for all event data, so only the ID is needed. Returns an identical schema to `GET /events/:id`.

`{ event: Event }`

404 `{ message: 'Event <id> not found' }` if event does not exist in the USCF database.