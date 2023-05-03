# Id generation tools

This package contains function to generate random or incrementing alphanumeric ids

# Usage

```typescript
import { makeIdGenerator } from "@sakartvelosoft/id-generation";
```

## Incremental alphanumerics

These are incrementing and formatted in base36 (0-9, a-z) alphabet. 

```typescript
    let generator = makeIdGenerator({
        format: 'test_[identity]',
        identityKind: 'incremental'
    });
    let result:string[] = [];
    for(let x = 0; x < 10; x++) {
        result.push(generator());
    }
    for(let id of result) {
        expect(id).match(/test_(\d|[a-z]){10}/);
    }
    let sortResult = result.slice().sort();
    expect(result).eql(sortResult);
    
```

## Random alphanumeric Ids

These ids are randomly generated with base64Url (0-9,a-z,A-Z,_,-) alphabet 

```typescript
        let generator = makeIdGenerator({
            format: 'test_[identity]',
            identityKind: 'random',
            identityLength: 32
        });
        let counters = new Map<string, number>();
        for(let x = 0; x < 1000; x++) {
            let id = generator();
            expect(id).length(`test_`.length+ 32);
            if (counters.has(id)) {
                fail(`${id} already has been generated`);
            }
            counters.set(id, 1);
            console.log(id);
        }

```

## Custom id generation

When none of default id generation does not satisfy your use case, you can do a generator based on custom function:

```typescript
        let generator = makeIdGenerator({
            format: 'test_[identity]',
            identityKind: 'custom',
            customIdentityGenerator: (() => {
               let bytes = randomBytes(32);
               let result = '';
               for(let x= 0; x < 4; x++) {
                   result = result.concat(bytes.readBigUInt64BE(x*8).toString(36));
               }
               return result.substring(0,32);
            })
        });
        let counters = new Map<string, number>();
        for(let x = 0; x < 1000; x++) {
            let id = generator();
            console.log(id);
            expect(id).match(/test_[0-9a-z]{32}/);
            if (counters.has(id)) {
                fail(`${id} already has been generated`);
            }
            counters.set(id, 1);
        }

```

## Known formatting tokens

These formatting tokens are recognized:
* `[prefix]` - `prefix` value from options
* `[machine]` - the `os.hostname()` from operating system
* `[init_time]` - an alphanumerical value, base36 of timestamp when the generation function has been created with `makeIdGenerator` call.
* `[identity]` - the thing "identity" value, either random or auto-incrementing alphanumerical depending on options you give, including completely custom value

The result id literal will be cropped away of `__` (multiple under-scores in consequentially).

Default format template is 
```
[prefix]_[machine]_[init_time]_[identity]
```

The following constants are provided as most expected ID templates:
* `ID_FORMAT_DEFAULT` - the string shown above, with prefix, machine hostname, init-time token, and generated identity
* `ID_FORMAT_PREFIX_MACHINE_IDENTITY` - string consisting only of prefix, machine hostname, and generated identity,
* `ID_FORMAT_PREFIX_IDENTITY` - string consisting only of prefix and generated identity

## Template limitations
For randomly generated (`random` and `custom` identities, where `format` has the `_` (underscores), incl. default format, 
the `__` (double underscores) are allowed outside generated part, and not allowed if explicitly set to `false`.
Set `allowMultipleUnderscores` to `true` if do not care about `__` from resulting ID outside of `identity` part.