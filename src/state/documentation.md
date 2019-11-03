
## State hierarchy

| *State* | *Type* | *Description* |
| ------- | ------ | ------------- |
| message | string | message shown on status bar |
| spinner | boolean | spinner parallel to message |
| devices | list | list of discovered devices |
| device | object | currently connected device |
| modules | object | modules supported by the platform |
| modules.X | object | a single module |
| modules.X.name | string | displayable name of the module |
| modules.X.programs | list<object> | pre-selectable programs |
| modules.X.programs.id | string | program id |
| modules.X.programs.name | string | program displayable name |
| modules.X.program | object | currently-selected program (by module) |
| modules.X.controls | list<object> | pre-selectable controls |
| modules.X.controls.id | string | program id |
| modules.X.controls.name | string | program dispayable name |
| modules.X.controls.type | string | control type. "int" for slider 0-100, "bool" for switch |
| modules.X.controls.value | int | value of the control |
