var Blueprint = require("montage/core/meta/blueprint").Blueprint;
var EventDescriptor = require("montage/core/meta/event-descriptor").EventDescriptor;

var Serializer = require("montage/core/serialization/serializer/montage-serializer").MontageSerializer;
var Deserializer = require("montage/core/serialization/deserializer/montage-deserializer").MontageDeserializer;

describe("meta/event-blueprint-spec", function () {

    describe("EventBlueprint", function () {

        var blueprint, eventBlueprint;
        beforeEach(function () {
            blueprint = new Blueprint().initWithName("testBlueprint");
            eventBlueprint = new EventDescriptor().initWithNameAndObjectDescriptor("event", blueprint);
        });

        it("has the correct name", function () {
            expect(eventBlueprint.name).toEqual("event");
        });

        describe("detailKeys", function () {
            it("can be pushed to", function () {
                eventBlueprint.detailKeys.push("pass");
                expect(eventBlueprint.detailKeys).toEqual(["pass"]);
            });

            it("can be set", function () {
                eventBlueprint.detailKeys = ["pass"];
                expect(eventBlueprint.detailKeys).toEqual(["pass"]);
            });

            it("can not be set to a string", function () {
                eventBlueprint.detailKeys = "fail";
                expect(eventBlueprint.detailKeys).toEqual([]);
            });
        });

        describe("serialization", function () {
            var serializer, blueprintSerialization, objectDescriptorSerialization;

            beforeEach(function () {
                blueprintSerialization = {
                    "root": {
                        "prototype": "montage/core/meta/event-blueprint",
                        "properties": {
                            "name": "event",
                            "blueprint": {"@": "blueprint_testblueprint"}
                        }
                    },
                    "blueprint_testblueprint": {}
                };
                objectDescriptorSerialization = {
                    "root": {
                        "prototype": "montage/core/meta/event-descriptor",
                        "properties": {
                            "name": "event",
                            "objectDescriptor": {"@": "objectDescriptor_testblueprint"}
                        }
                    },
                    "objectDescriptor_testblueprint": {}
                };
                serializer = new Serializer().initWithRequire(require);
                serializer.setSerializationIndentation(4);
            });

            it("should serialize correctly", function () {
                var expectedSerialization,
                    serialization;

                expectedSerialization = objectDescriptorSerialization;

                serialization = serializer.serializeObject(eventBlueprint);
                expect(JSON.parse(serialization))
                    .toEqual(expectedSerialization);
            });

            xit("should deserialize correctly", function (done) {
                var deserializer = new Deserializer().init(JSON.stringify(blueprintSerialization), require);
                deserializer.deserializeObject({blueprint_testblueprint: blueprint}).then(function (deserialized) {
                    expect(deserialized).toEqual(eventBlueprint);
                }).finally(function () {
                    done();
                });
            });
        });
    });
});
