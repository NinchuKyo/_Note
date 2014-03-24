//
//  TestTableViewController.m
//  _Note
//
//  Created by Graeme Peters on 2014-03-21.
//  Copyright (c) 2014 Lyndon Quigley. All rights reserved.
//

#import "QUnit.h"
#import "TableViewController.h"
#import "TestTableViewController.h"

@implementation TestTableViewController

- (void)setUp
{
    [super setUp];
    // Put setup code here. This method is called before the invocation of each test method in the class.
}

- (void)tearDown
{
    // Put teardown code here. This method is called after the invocation of each test method in the class.
    [super tearDown];
}

- (void)testSuccess
{
    //test success = 1
    NSError *e = nil;
    NSString* jsonString =@"{\"msg\":\"\",\"note_titles\":[{\"Title\" : \"Hey\"}], \"success\":\"1\"}";
    NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary* json = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error: &e];
    TableViewController *t = [[TableViewController alloc] init];
    equal([t getTitlesFromJson:json], @"Parsed JSON note title data from server", @"Should equal success msg");
    
    //test success = 0
    e = nil;
    jsonString =@"{\"msg\":\"\",\"note_titles\":[{\"Title\" : \"Hey\"}], \"success\":\"0\"}";
    jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    json = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error: &e];
    t = [[TableViewController alloc] init];
    equal([t getTitlesFromJson:json], @"Failed to parse JSON note title data from server", @"Should equal fail msg");
    
    //test no success
    e = nil;
    jsonString =@"{\"msg\":\"\",\"note_titles\":[{\"Title\" : \"Hey\"}]}";
    jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    json = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error: &e];
    t = [[TableViewController alloc] init];
    equal([t getTitlesFromJson:json], @"Failed to parse JSON note title data from server", @"Should equal fail msg");
}

- (void)testNoNoteTitles
{
    NSError *e = nil;
    NSString* jsonString =@"{\"msg\":\"\", \"success\":\"1\" }";
    NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary* json = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error: &e];
    TableViewController *t = [[TableViewController alloc] init];
    [t getTitlesFromJson:json];
    NSArray * titles= [t titles];
    equal([titles count], 0, @"Titles should exist but be empty");
}

- (void)testSameTitle
{
    NSError *e = nil;
    NSString* jsonString =@"{\"msg\":\"\", \"note_titles\":[{\"Title\":\"Hey\"}, {\"Title\":\"Hey\"}, {\"Title\":\"You\"}, {\"Title\":\"You\"}], \"success\":\"1\" }";
    NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary* json = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error: &e];
    TableViewController *t = [[TableViewController alloc] init];
    [t getTitlesFromJson:json];
    NSArray * titles= [t titles];
    equal([titles count], 4, @"Notes with same title will be loaded normally");
}

- (void)testReceivingBadNoteTitles
{
    NSError *e = nil;
    NSString* jsonString =@"{\"msg\":\"\", \"note_titles\":[{\"Title\":\"H@@&e***//-++&&&&y\"}, {\"Title\":\"Hey\"}, {\"Title\":\"Y**#$$$#!@#%$*o%%&&u\"}, {\"Title\":\"You\"}], \"success\":\"1\" }";
    NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary* json = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error: &e];
    TableViewController *t = [[TableViewController alloc] init];
    [t getTitlesFromJson:json];
    NSArray * titles= [t titles];
    equal([titles count], 4, @"No titles are rejected");
    equal([[titles objectAtIndex:0] objectForKey:@"Title"], @"H@@&e***//-++&&&&y", @"Assume the server gives us correct titles so no changes are made");
}

@end
