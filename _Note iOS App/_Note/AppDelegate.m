//
//  AppDelegate.m
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//

#import "AppDelegate.h"
#import "Note.h"
#import <DropboxSDK/DropboxSDK.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    /*
    // Request server for JSON, url of server to request from
    NSString *urlString = @"https://localhost:5000/";
    NSURL *url = [NSURL URLWithString:urlString];
    
    // HTTP request to server
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    [urlRequest setTimeoutInterval:10];
    [urlRequest setHTTPMethod:@"GET"];
    
    //allocate a new operation queue
    //NSOperationQueue *queue = [[NSOperationQueue alloc] init];
    
    // Establish connection
    NSURLConnection *connection = [[NSURLConnection alloc] initWithRequest:urlRequest delegate:self startImmediately:YES];
    */
    
    // Authenticate to Dropbox
    DBSession *dbSession = [[DBSession alloc]
                            initWithAppKey:@"uwjvcs6f8kegvt1"
                            appSecret:@"l8p42osw8uriwyj"
                            root:kDBRootAppFolder]; // either kDBRootAppFolder or kDBRootDropbox
    [DBSession setSharedSession:dbSession];
    
    // Override point for customization after application launch.
    self.notes = [NSMutableArray arrayWithArray: @[
            [Note noteWithText: @"Will load the list of notes in this area here."]]];
    UISplitViewController *splitViewController = (UISplitViewController *)self.window.rootViewController;
    UINavigationController *navigationController = [splitViewController.viewControllers lastObject];
    splitViewController.delegate = (id)navigationController.topViewController;
    return YES;
}
							
- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

/*
#pragma mark NSURLConnectionDelegate

- (BOOL)connection:(NSURLConnection *)connection canAuthenticateAgainstProtectionSpace:(NSURLProtectionSpace *)protectionSpace {
    NSLog(@"protectionSpace: %@", [protectionSpace authenticationMethod]);
    
    // We only know how to handle NTLM authentication.
    if([[protectionSpace authenticationMethod] isEqualToString:NSURLAuthenticationMethodNTLM])
        return YES;
    
    // Explicitly reject ServerTrust. This is occasionally sent by IIS.
    if([[protectionSpace authenticationMethod] isEqualToString:NSURLAuthenticationMethodServerTrust])
        return NO;
    
    return NO;
}

- (void)connection:(NSURLConnection *)connection didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge {
    [[challenge sender] continueWithoutCredentialForAuthenticationChallenge:challenge];
}

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
    NSLog(@"%@", response);
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    NSLog(@"%@", data);
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
    NSLog(@"didFailWithError");
    NSLog([NSString stringWithFormat:@"Connection failed: %@", [error description]]);
}

- (void)connection:(NSURLConnection *)connection willSendRequestForAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge {
    [[challenge sender] useCredential:[NSURLCredential
                                       credentialWithUser:@"user"
                                       password:@"password"
                                       persistence:NSURLCredentialPersistencePermanent] forAuthenticationChallenge:challenge];
    
}
*/

@end
